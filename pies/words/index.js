const {makePie} = require('miraipie');
const {Program} = require('../command');
const axios = require('axios');

module.exports = (ctx) => {
    ctx.pie(makePie({
        id: 'words',
        name: '一言',
        version: '0.0.1',
        author: 'Nepsyn',
        enabled() {
            const words = Program.program('words');
            words
                .aliases(['一言'])
                .description('一言')
                .usage('words')
                .action(async (args, chat, chain) => {
                    await chat.send((await axios.get('https://api.vvhan.com/api/ian', {responseType: 'text'})).data, chain.sourceId);
                });
            words
                .command('love')
                .aliases(['情话'])
                .description('土味情话')
                .usage('words love')
                .action(async (args, chat, chain) => {
                    await chat.send((await axios.get('https://api.vvhan.com/api/love', {responseType: 'text'})).data, chain.sourceId);
                });
        },
        disabled() {
            Program.delete('words');
        }
    }));
};
