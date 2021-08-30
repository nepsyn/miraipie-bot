const {makePie, Plain} = require('miraipie');
const {Program} = require('../command');
const {Limiter} = require('../limiter');
const {cron, cancel} = require('../schedule');
const {db} = require('../db');

module.exports = (ctx) => {
    ctx.pie(makePie({
        id: 'statistics',
        name: '数据统计',
        version: '0.0.1',
        author: 'Nepsyn',
        configMeta: {
            groups: {
                type: Array,
                description: '需要播报的群号列表',
                default: () => []
            }
        },
        methods: {
            /**
             * 统计数据
             * @param group {number} 群号
             * @param timeStart {Date} 开始时间
             * @param timeEnd {Date} 结束时间
             * @return {Array}
             */
            async stat(group, timeStart, timeEnd) {
                const limiter = Limiter.getLimiter(group);
                const span = limiter.span('stat');
                if (!span.get()) {
                    const records = db.queryMessages({
                        to: group,
                        type: 'GroupMessage',
                        timeStart, timeEnd
                    });
                    const memberList = (await ctx.api.getMemberList(group)).data;
                    /** @type {Map<string, number>} */
                    const map = new Map();
                    for (const record of records) {
                        const member = memberList.find((m) => m.id === record.from);
                        if (member) {
                            if (!map.has(member.memberName)) map.set(member.memberName, 0);
                            map.set(member.memberName, map.get(member.memberName) + 1);
                        }
                    }
                    return Array.from(map).sort((ma, mb) => ma[1] < mb[1] ? 1 : -1).slice(0, 5);
                }

                return span.get();
            },
            async makeStatMessage(group, day = 0) {
                const timeEnd = Limiter.TOMORROW();
                const timeStart = new Date(timeEnd.getTime());
                timeStart.setDate(timeStart.getDate() - 1 - day);
                timeEnd.setDate(timeEnd.getDate() - day);
                const stat = await this.stat(group, timeStart, timeEnd);
                const dayString = day === 0 ? '今日' : day === 1 ? '昨日' : day === 2 ? '前日' : `${day}天前`;
                if (stat.length === 0) return [Plain(`没有${dayString}的发言记录`)];

                const chain = [];
                if (stat.length > 0) chain.push(Plain(`${dayString}话王: ${stat[0][0]}\n🥇 ${stat[0][0]} - ${stat[0][1]}`));
                if (stat.length > 1) chain.push(Plain(`\n🥈 ${stat[1][0]} - ${stat[1][1]}`));
                if (stat.length > 2) chain.push(Plain(`\n🥉 ${stat[2][0]} - ${stat[2][1]}`));
                if (stat.length > 3) chain.push(Plain(`\n4️⃣ ${stat[3][0]} - ${stat[3][1]}`));
                if (stat.length > 4) chain.push(Plain(`\n5️⃣ ${stat[4][0]} - ${stat[4][1]}`));
                return chain;
            }
        },
        enabled() {
            Program
                .program('stat')
                .aliases(['statistics', '统计', '话王'])
                .on((chat) => chat.isGroupChat())
                .description('统计群员发言情况')
                .usage('stat [days]')
                .action(async (args, chat) => {
                    let day = 0;
                    if (args && args.length > 0) day = isNaN(parseInt(args[0])) ? 0 : Math.abs(parseInt(args[0]));
                    await chat.send(await this.makeStatMessage(chat.contact.id, day));
                });
            cron('stat', '5 0 0 * * *', async () => {
                for (const group of this.configs.groups || []) {
                    const chain = await this.makeStatMessage(group, 1);
                    if (chain.length > 1) await ctx.api.sendGroupMessage(group, chain);
                }
            });
        },
        disabled() {
            Program.delete('stat');
            cancel('stat');
        }
    }));
};
