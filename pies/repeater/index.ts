import {makePie, MiraiPieApplication, PieFilter} from 'miraipie';

module.exports = (ctx: MiraiPieApplication) => {
    ctx.pie(makePie({
        id: 'repeater',
        name: '复读机',
        version: '0.0.1',
        author: 'Nepsyn',
        filters: [PieFilter.fromFriend],
        async received(chat, chain) {
            await chat.send(chain);
        }
    }));
};
