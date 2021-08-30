const {makePie} = require('miraipie');
const {Program} = require('../command');
const {Limiter} = require('../limiter')

module.exports = (ctx) => {
    ctx.pie(makePie({
        id: 'jrrp',
        name: '今日人品',
        version: '0.0.1',
        author: 'Nepsyn',
        enabled() {
            Program
                .program('jrrp')
                .aliases(['人品', '今日人品', 'rp'])
                .description('查看每日人品值')
                .usage('jrrp')
                .action(async (args, chat) => {
                    const span = Limiter.getLimiter(chat.sender.id).span('jrrp');
                    if (!span.get()) {
                        span.expire(Limiter.TOMORROW()).set(Math.round(Math.random() * 100));
                    }
                    if (chat.isGroupChat()) {
                        await chat.send(`${chat.sender.memberName} 今天的人品值是：${span.get()}`);
                    } else {
                        await chat.send(`今天的人品值是：${span.get()}`);
                    }
                });
        },
        disabled() {
            Program.delete('jrrp');
        }
    }));
};
