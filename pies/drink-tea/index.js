const {makePie, makeImage, makeVoice} = require('miraipie');
const {cron, cancel} = require('../schedule');
const fs = require('fs');
const path = require('path');

module.exports = (ctx) => {
    ctx.pie(makePie({
        id: 'drink-tea',
        name: '饮茶提醒',
        version: '0.0.1',
        author: 'Nepsyn',
        configMeta: {
            groups: {
                type: Array,
                description: `需要提醒饮茶的群号列表`,
                default: () => []
            }
        },
        enabled() {
            cron('drink-tea', '0 0 15 * * *', async () => {
                for (const group of this.configs.groups) {
                    const picture = fs.readFileSync(path.join(__dirname, 'drink.jpg'));
                    const voice = fs.readFileSync(path.join(__dirname, 'drink.silk'));
                    setTimeout(async () => {
                        await ctx.api.sendGroupMessage(group, [
                            makeImage({base64: picture.toString('base64')})
                        ]);
                        await ctx.api.sendGroupMessage(group, [
                            makeVoice({base64: voice.toString('base64')})
                        ]);
                    }, Math.round(Math.random()) * 5000);
                }
            });
        },
        disabled() {
            cancel('drink-tea');
        }
    }));
};
