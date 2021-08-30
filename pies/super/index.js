const {makePie} = require('miraipie');
const {Program} = require('../command');

module.exports = (ctx) => {
    ctx.pie(makePie({
        id: 'super',
        name: '管理员操作',
        version: '0.0.1',
        author: 'Nepsyn',
        configMeta: {
            admin: {
                type: Number,
                description: '管理员账号',
                default: () => null
            }
        },
        enabled() {
            const su = Program
                .program('super')
                .aliases(['manage'])
                .description('管理员操作')
                .usage('super <command> [args]')
                .on((chat) => chat.sender.id === this.configs.admin)
                .action(async (args, chat) => {
                    await chat.send(`发送${Program.prefix}help super查看命令使用帮助`);
                });

            su
                .command('enable')
                .aliases(['e'])
                .description('启用pie')
                .usage('super enable <pie>')
                .action(async (args, chat) => {
                    if (args && args.length > 0) {
                        ctx.enable(args[0]);
                        await chat.send(`已启用pie: ${args[0]}`);
                    } else {
                        await chat.send('缺少pie名称');
                    }
                });

            su
                .command('disable')
                .aliases(['d'])
                .description('禁用pie')
                .usage('super disable <pie>')
                .action(async (args, chat) => {
                    if (args && args.length > 0) {
                        ctx.disable(args[0]);
                        await chat.send(`已禁用pie: ${args[0]}`);
                    } else {
                        await chat.send('缺少pie名称');
                    }
                });
        },
        disabled() {
            Program.delete('super');
        }
    }));
};
