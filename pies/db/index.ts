import sqlite3 from 'better-sqlite3';
import {MessageChain, Mirai, MiraiPieApplication} from 'miraipie';
import * as path from 'path';

/**
 * 转化日期对象为字符串
 */
function formatDate(date: Date): string {
    if (!date) return null;
    return `${date.getUTCFullYear()}-` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
        `${date.getDate().toString().padStart(2, '0')} ` +
        `${date.getHours().toString().padStart(2, '0')}:` +
        `${date.getMinutes().toString().padEnd(2, '0')}:` +
        `${date.getSeconds().toString().padStart(2, '0')}`;
}

/**
 * 数据库中消息记录
 */
interface MessageRecord {
    /**
     * 消息id
     */
    sourceId: number;
    /**
     * 消息链
     */
    messageChain: MessageChain;
    /**
     * 消息发送人QQ号
     */
    from: number;
    /**
     * 消息接收者账号
     */
    to: number;
    /**
     * 消息类型
     */
    type: Mirai.ChatMessageType;
    /**
     * 时间
     */
    time?: Date;
}

/**
 * 数据库中事件记录
 */
interface EventRecord {
    /**
     * 事件内容
     */
    event: Mirai.Event;
    /**
     * 事件类型
     */
    type: Mirai.EventType;
    /**
     * 时间
     */
    time?: Date;
}

/**
 * 数据库adapter
 */
export abstract class DatabaseAdapter {
    /**
     * adapter类型
     */
    readonly type: string;
    /**
     * 是否已打卡
     */
    abstract open: boolean;
    /**
     * 数据库文件路径
     */
    abstract path: string;

    /**
     * 关闭当前数据库
     */
    abstract close();

    /**
     * 保存一条消息
     * @param record 消息记录
     */
    abstract saveMessage(record: MessageRecord): boolean;

    /**
     * 根据消息id获取一条消息原始记录
     * @param messageId
     */
    abstract getMessageById(messageId: number): MessageRecord;

    /**
     * 通过指定条件查询消息记录
     * @param conditions 查询条件
     */
    abstract queryMessages(conditions?: {
        from?: number;
        to?: number;
        type?: Mirai.ChatMessageType;
        timeStart?: Date;
        timeEnd?: Date;
    }): MessageRecord[];

    /**
     * 保存一个事件
     * @param record 事件
     */
    abstract saveEvent(record: EventRecord): boolean;

    /**
     * 通过指定条件查询事件记录
     * @param conditions 查询条件
     */
    abstract queryEvents(conditions?: {
        type?: Mirai.EventType;
        timeStart?: Date;
        timeEnd?: Date;
    }): EventRecord[];

    /**
     * 删除历史消息
     * @param days 和当前日期相差天数
     */
    abstract clearMessageHistory(days: number): number;

    /**
     * 删除历史事件
     * @param days 和当前日期相差天数
     */
    abstract clearEventHistory(days: number): number;
}

export class Sqlite3Adapter extends DatabaseAdapter {
    readonly type = 'Sqlite3Adapter';
    private database: sqlite3.Database;

    get open(): boolean {
        return this.database && this.database.open;
    }

    constructor(public path: string) {
        super();
        this.database = sqlite3(path, {
            fileMustExist: true
        });
    }

    close() {
        this.database?.close();
        this.database = null;
    }

    saveMessage(record: MessageRecord): boolean {
        const resp = this.database
            ?.prepare('INSERT INTO message (id, content, from_id, to_id, type) VALUES ($sourceId, $content, $fromId, $toId, $type)')
            .run({
                sourceId: record.sourceId,
                content: JSON.stringify(MessageChain.from(record.messageChain).dropped('Source')),
                fromId: record.from,
                toId: record.to,
                type: record.type
            });
        return resp?.changes > 0;
    }

    getMessageById(messageId: number) {
        const record = this.database
            .prepare('SELECT id sourceId, content messageChain, from_id [from], to_id [to], type, timestamp time FROM message WHERE id=?')
            .get(messageId);
        if (record) {
            record.messageChain = MessageChain.from(JSON.parse(record.messageChain));
            record.time = new Date(record.time);
        }
        return record;
    }

    queryMessages(conditions: {
        from?: number;
        to?: number;
        type?: Mirai.ChatMessageType;
        timeStart?: Date;
        timeEnd?: Date;
    } = {}): MessageRecord[] {
        let sql = 'SELECT id sourceId, content messageChain, from_id [from], to_id [to], type, timestamp time FROM message';
        const queries = [];
        if (conditions.from) queries.push('from_id=$from');
        if (conditions.to) queries.push('to_id=$to');
        if (conditions.type) queries.push('type=$type');
        if (conditions.timeStart) queries.push('timestamp>=$timeStart');
        if (conditions.timeEnd) queries.push('timestamp<=$timeEnd');
        if (queries.length > 0) sql += (' WHERE ' + queries.join(' AND '));
        const records = this.database
            ?.prepare(sql)
            .all({
                ...conditions,
                timeStart: formatDate(conditions?.timeStart),
                timeEnd: formatDate(conditions?.timeEnd)
            });
        for (const record of records) {
            record.messageChain = MessageChain.from(JSON.parse(record.messageChain));
            record.time = new Date(record.time);
        }
        return records;
    }

    saveEvent(record: EventRecord): boolean {
        const resp = this.database
            ?.prepare('INSERT INTO event (content, type) VALUES ($content, $type)')
            .run({
                content: JSON.stringify(record.event),
                type: record.type
            });
        return resp?.changes > 0;
    }

    queryEvents(conditions: {
        type?: Mirai.EventType;
        timeStart?: Date;
        timeEnd?: Date;
    } = {}): EventRecord[] {
        let sql = 'SELECT content event, type, timestamp time FROM event';
        const queries = [];
        if (conditions.type) queries.push('type=$type');
        if (conditions.timeStart) queries.push('timestamp>=$timeStart');
        if (conditions.timeEnd) queries.push('timestamp<=$timeEnd');
        if (queries.length > 0) sql += (' WHERE ' + queries.join(' AND '));
        const records = this.database
            ?.prepare(sql)
            .all({
                ...conditions,
                timeStart: formatDate(conditions?.timeStart),
                timeEnd: formatDate(conditions?.timeEnd)
            });
        for (const record of records) {
            record.event = JSON.parse(record.event);
            record.time = new Date(record.time);
        }
        return records;
    }

    clearMessageHistory(days: number): number {
        return this.database
            ?.prepare(`DELETE FROM message WHERE JULIANDAY(DATETIME('now', 'localtime'))-JULIANDAY(DATETIME(timestamp))>?`)
            .run(days)
            ?.changes;
    }

    clearEventHistory(days: number): number {
        return this.database
            ?.prepare(`DELETE FROM event WHERE JULIANDAY(DATETIME('now', 'localtime'))-JULIANDAY(DATETIME(timestamp))>?`)
            .run(days)
            ?.changes;
    }
}

export const db = new Sqlite3Adapter(path.join(process.cwd(), 'miraipie.db'));

module.exports = (ctx: MiraiPieApplication) => {
    ctx.on('message', (chatMessage) => {
        db.saveMessage({
            sourceId: MessageChain.from(chatMessage.messageChain).sourceId,
            messageChain: chatMessage.messageChain,
            type: chatMessage.type,
            from: chatMessage.sender.id,
            to: chatMessage.type === 'GroupMessage' ? (chatMessage.sender as Mirai.GroupMember).group.id : ctx.qq
        });
    });

    ctx.on('event', (event) => {
        db.saveEvent({
            type: event.type,
            event: event,
        });
    });
}

module.exports.db = db;
