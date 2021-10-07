const {makePie, makeImage, Plain} = require('miraipie');
const {Program} = require('../command');
const axios = require('axios');

module.exports = (ctx) => {
    ctx.pie(makePie({
        id: 'saucenao',
        name: '搜图工具',
        version: '0.0.1',
        author: 'Nepsyn',
        configMeta: {
            apiKey: {
                type: String,
                description: 'saucenao提供的apiKey',
                required: true
            }
        },
        enabled() {
            Program
                .program('pic')
                .aliases(['search', '搜图'])
                .description('搜索图片(当前支持Pixiv和动画)')
                .usage('pic')
                .action(async (args, chat, chain) => {
                    await chat.send('请发送要搜索的图片', chain.sourceId);
                    chat.nextMessage().then(async (chain) => {
                        const pic = chain.selected('Image').f;
                        if (pic && pic.isType('Image')) {
                            axios.get('https://saucenao.com/search.php', {
                                params: {
                                    output_type: 2,
                                    api_key: this.configs.apiKey,
                                    dbmask: 999,
                                    numres: 1,
                                    url: pic.url
                                }
                            }).then(async (resp) => {
                                const {header, results} = resp.data;
                                if (header['status'] !== 0) {
                                    await chat.send('没有找到类似的结果');
                                    return;
                                }

                                const {header: info, data} = results[0];
                                const {similarity, thumbnail} = info;
                                if (parseFloat(similarity) < 60) {
                                    await chat.send('没有找到类似的结果');
                                    return;
                                }

                                const index = info['index_id'];
                                const chain = [makeImage({url: thumbnail}), Plain(`相似度 ${similarity}%\n`)];
                                if (index === 5 || index === 6) {
                                    chain.push(Plain(`pixiv id: ${data['pixiv_id']}\n`));
                                    chain.push(Plain(`标题: ${data['title']}`));
                                } else if (index === 21) {
                                    chain.push(Plain(`动画: ${data['source']} ${data['part']}`));
                                } else {
                                    const {ext_urls, ...rest} = data;
                                    chain.push(Plain('未知数据库\n'))
                                    for (const key in rest) {
                                        chain.push(Plain(`${key}: ${rest[key]}\n`));
                                    }
                                }
                                await chat.send(chain);
                            }).catch(async (err) => {
                                await chat.send('查询图片出错');
                                this.logger.error('查询出错:', err);
                            });
                        } else {
                            await chat.send('没有发送图片文件, 已取消搜索');
                        }
                    });
                });
        },
        disabled() {
            Program.delete('pic')
        }
    }));
};
