const axios = require('axios');
const {makePie, Plain} = require('miraipie');
const {Program} = require('../command');

module.exports = (ctx) => {
    ctx.pie(makePie({
        id: 'wb-hot',
        name: '微博热搜',
        version: '0.0.1',
        author: 'Nepsyn',
        data: {
            icons: ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
        },
        enabled() {
            Program
                .program('hot')
                .aliases(['热搜', '微博热搜', 'wb-hot'])
                .description('查看微博热搜榜')
                .usage('hot')
                .action(async (args, chat) => {
                    /** @type {{data: number, list: Array<{name: string, hot: number}> }} */
                    const data = (await axios.get('https://tenapi.cn/resou/')).data;
                    if (data.data === 200) {
                        const chain = [Plain('微博热搜榜单:')];
                        for (let i = 0; i < data.list.length && i < 10; i++) {
                            chain.push(Plain(`\n${this.icons[i]} ${data.list[i].name} - ${data.list[i].hot}`));
                        }
                        await chat.send(chain);
                    }
                });
        },
        disabled() {
            Program.delete('hot');
        }
    }));
};
