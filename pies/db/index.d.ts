import { MessageChain, Mirai } from 'miraipie';
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
export declare abstract class DatabaseAdapter {
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
    abstract close(): any;
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
export declare class Sqlite3Adapter extends DatabaseAdapter {
    path: string;
    readonly type = "Sqlite3Adapter";
    private database;
    get open(): boolean;
    constructor(path: string);
    close(): void;
    saveMessage(record: MessageRecord): boolean;
    getMessageById(messageId: number): any;
    queryMessages(conditions?: {
        from?: number;
        to?: number;
        type?: Mirai.ChatMessageType;
        timeStart?: Date;
        timeEnd?: Date;
    }): MessageRecord[];
    saveEvent(record: EventRecord): boolean;
    queryEvents(conditions?: {
        type?: Mirai.EventType;
        timeStart?: Date;
        timeEnd?: Date;
    }): EventRecord[];
    clearMessageHistory(days: number): number;
    clearEventHistory(days: number): number;
}
export declare const db: Sqlite3Adapter;
export {};
