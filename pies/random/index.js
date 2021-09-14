const {makePie} = require('miraipie');
const {Program} = require('../command');

module.exports = (ctx) => {
    ctx.pie(makePie({
        id: 'random',
        name: '随机生成器',
        version: '0.0.1',
        author: 'Nepsyn',
        enabled() {
            const random = Program
                .program('random')
                .description('随机生成器')
                .usage('random [command] [...args]')
                .action(async (args, chat, chain) => {
                    await chat.send(Math.random().toString(), chain.sourceId);
                });

            random
                .command('roll')
                .aliases(['r'])
                .description('随机roll点数')
                .usage('random roll [limit]\nlimit用于指定点数上限, 默认为1, roll出的值区间在[0, limit]')
                .action(async (args, chat, chain) => {
                    const limit = parseInt(args[0]) || 1;
                    await chat.send(Math.round(Math.random() * limit).toString(), chain.sourceId);
                });

            random
                .command('pick')
                .aliases(['p'])
                .description('随机选择选项')
                .usage('random pick <...choices>\nchoices表示选项, 至少有两个')
                .action(async (args, chat, chain, command) => {
                    if (args.length < 2) {
                        await chat.send(command.help());
                        return;
                    }
                    await chat.send(args[Math.floor(Math.random() * args.length)], chain.sourceId);
                });

            random
                .command('member')
                .on((chat) => chat.isGroupChat())
                .aliases(['m'])
                .description('随机选择群成员(除机器人)')
                .usage('random member')
                .action(async (args, chat, chain) => {
                    const members = await ctx.api.getMemberList(chat.contact.id);
                    const names = members.data.filter((member) => member.id !== ctx.id).map((member) => member.memberName);
                    await chat.send(names[Math.floor(Math.random() * names.length)], chain.sourceId);
                });
        },
        disabled() {
            Program.delete('random');
        }
    }));
};
