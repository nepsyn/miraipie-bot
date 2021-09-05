import {Program} from '../command';
import {makePie, MiraiPieApplication, GroupChat, MessageChain, At, Plain, PieFilter} from 'miraipie';
import Timeout = NodeJS.Timeout;
const dictionary = require('./dictionary.json') as Dictionary;
const allWords = Object.keys(dictionary);

interface Dictionary {
    [word: string]: {
        usphone: string;
        ukphone: string;
        phone: string;
        remMethod?: string;
        trans: {
            tranCn: string;
            tranOther?: string;
            pos: string;
        }[];
        sentences: {
            sContent: string;
            sCn: string;
        }[];
        phrases: {
            pContent: string;
            pCn: string;
        }[];
        rels: {
            pos: string;
            words: {
                hwd: string;
                tran: string;
            }[];
        }[];
        synos: {
            pos: string;
            tran: string;
            hwds: string[];
        }[];
    };
}

class RaceGame {
    words: string[];
    round: number;
    score: Map<number, number>;
    midfield: boolean;
    timeout: Timeout;

    constructor(public chat: GroupChat, public onOver: Function, public term: number = 10) {
        this.words = allWords.concat([]).sort(() => 0.5 - Math.random());
        this.round = 0;
        this.score = new Map();
        this.midfield = false;
    }

    get currentWord() {
        return this.words[this.round - 1];
    }

    get isOver() {
        return this.round > this.term;
    }

    cancel() {
        if (this.timeout) clearTimeout(this.timeout);
        this.round = this.term;
    }

    async next(immediate: boolean = false) {
        if (!immediate) await this.chat.send('3s后开启下一轮');
        setTimeout(async () => {
            if (!this.isOver) {
                this.midfield = false;
                this.round++;
                await this.chat.send([
                    Plain(`第(${this.round}/${this.term})局，时限：30s\n`),
                    Plain(dictionary[this.currentWord].trans.map((tr) => `[${tr.pos}] ${tr.tranCn}`).join('\n') + '\n'),
                    Plain(`该单词有${this.currentWord.length}个字母`),
                ]);

                this.timeout = setTimeout(async () => {
                    await this.chat.send(`提示：该单词的第一个字母是 ${this.currentWord[0]}`);
                    this.timeout = setTimeout(async () => {
                        await this.chat.send(`提示：该单词的发音是 /${dictionary[this.currentWord].phone}/`);
                        this.timeout = setTimeout(async () => {
                            await this.chat.send(`30s内没有人答出正确答案： ${this.currentWord}`);
                            this.round--;
                            this.words.splice(this.round, 1);
                            await this.next();
                        }, 10000);
                    }, 10000);
                }, 10000);
            }
        }, immediate ? 0 : 3000);
    }

    async over() {
        const score = Array.from(this.score.entries());
        const members = await this.chat.getMemberList();
        const scoreMap = score.map((s) => [members.find((m) => m.id === s[0]).memberName, s[1]]);
        scoreMap.sort((a, b) => a[0] < b [0] ? 1 : -1);
        const chain = [Plain('游戏结束，成绩排名：\n')];
        if (scoreMap.length > 0) chain.push(Plain(`🥇 ${scoreMap[0][0]} - ${scoreMap[0][1]}`));
        if (scoreMap.length > 1) chain.push(Plain(`\n🥈 ${scoreMap[1][0]} - ${scoreMap[1][1]}`));
        if (scoreMap.length > 2) chain.push(Plain(`\n🥉 ${scoreMap[2][0]} - ${scoreMap[2][1]}`));
        if (scoreMap.length > 3) chain.push(Plain(`\n4️⃣ ${scoreMap[3][0]} - ${scoreMap[3][1]}`));
        if (scoreMap.length > 4) chain.push(Plain(`\n5️⃣ ${scoreMap[4][0]} - ${scoreMap[4][1]}`));
        await this.chat.send(chain);
        await this.onOver();
    }

    async validate(chat: GroupChat, chain: MessageChain) {
        if (!this.midfield && !this.isOver) {
            if (chain.selected('Plain').toDisplayString().trim() === this.words[this.round - 1]) {
                this.score.set(chat.sender.id, (this.score.get(chat.sender.id) || 0) + 1);
                await chat.send([At(chat.sender.id), Plain(` 回答正确！积分+1，当前共${this.score.get(chat.sender.id)}分`)]);
                this.midfield = true;
                if (this.timeout) clearTimeout(this.timeout);
                if (this.round < this.term) {
                    await this.next();
                } else {
                    await this.over();
                }
            } else {
                // 回答错误
            }
        }
    }
}

module.exports = (ctx: MiraiPieApplication) => {
    ctx.pie(makePie({
        id: 'dict',
        name: '背单词',
        version: '0.0.4',
        author: 'Nepsyn',
        data: {
            dictionary,
            games: new Map<number, RaceGame>()
        },
        filters: [PieFilter.fromGroup],
        async received(chat, chain) {
            if (this.games.has(chat.contact.id)) {
                await this.games.get(chat.contact.id).validate(chat as GroupChat, chain);
            }
        },
        enabled() {
            const dict = Program
                .program('dict')
                .aliases(['单词', '辞书', '词典'])
                .description('简单背单词工具')
                .usage('dict <command> [...args]')
                .action(async (args , chat, chain, command) => {
                    await chat.send(command.help());
                });

            dict
                .command('search')
                .aliases(['s', '搜索'])
                .usage('dict search <word>')
                .description('搜索单词')
                .action(async (args, chat, chain, command) => {
                    if (args.length < 1) {
                        await chat.send(command.help());
                        return;
                    }
                    const word = args[0];
                    if (word in this.dictionary) {
                        const info = this.dictionary[word];
                        await chat.send(`${word} /${info.phone}/\n` + info.trans.map((tr) => `[${tr.pos}] ${tr.tranCn}`).join('\n'));
                    } else {
                        await chat.send(`没有找到单词: ${word}`);
                    }
                });

            const race = dict
                .command('race')
                .aliases(['r', '竞赛'])
                .on((chat) => chat.isGroupChat())
                .usage('dict race [term]\nterm为局数, 默认十局')
                .description('开启群内单词竞赛')
                .action(async (args, chat) => {
                    if (!this.games.has(chat.contact.id)) {
                        const game = new RaceGame(chat as GroupChat, () => {
                            this.games.delete(chat.contact.id);
                        }, parseInt(args[0]) || 10);
                        this.games.set(chat.contact.id, game);
                        await chat.send(`单词竞赛游戏开始, 发送${Program.prefix}dict race cancel可以立即取消已开始的游戏`);
                        await game.next(true);
                    }
                });

            race
                .command('cancel')
                .aliases(['c', '取消'])
                .on((chat) => chat.isGroupChat())
                .usage('dict race cancel\nterm为局数, 默认十局')
                .description('取消已开始的单词竞赛')
                .action(async (args, chat) => {
                    if (this.games.has(chat.contact.id)) {
                        const game = this.games.get(chat.contact.id);
                        game.cancel();
                        this.games.delete(chat.contact.id);
                        await chat.send('已取消竞赛');
                    } else {
                        await chat.send('没有正在进行中的竞赛');
                    }
                });
        },
        disabled() {
            Program.delete('dict');
            for (const game of this.games.values()) {
                game.cancel();
            }
            this.games.clear();
        }
    }));
};
