const {makePie, Plain, makeImage} = require('miraipie');
const {Program} = require('../command');
const {Limiter} = require('../limiter');
const sharp = require('sharp');

async function reverseImage(data) {
    return (await sharp(Buffer.from(data, 'base64')).rotate(180).toBuffer()).toString('base64');
}

module.exports = (ctx) => {
    ctx.pie(makePie({
        id: 'arcana',
        name: '阿尔卡纳牌',
        author: 'Nepsyn',
        version: '1.0.0',
        description: '抽阿尔卡纳牌',
        filters: [],
        data: {
            cards: require('./arcana.json')
        },
        enabled() {
            Program
                .program('arcana')
                .aliases(['阿尔卡纳', '阿卡那'])
                .description('抽取每日的阿尔卡纳牌')
                .usage('arcana')
                .action(async (args, chat) => {
                    const span = Limiter.getLimiter(chat.sender.id).span('arcana');
                    if (!span.get()) {
                        span.expire(Limiter.TOMORROW()).set({
                            index: Math.floor(Math.random() * this.cards.length),
                            reversed: Math.random() > 0.5
                        });
                    }
                    const {index, reversed} = span.get();
                    const card = this.cards[index];
                    const message = [
                        makeImage({base64: reversed ? await reverseImage(card['data']) : card['data']}),
                        Plain(`${card['cn_name']}(${card['name']}) ${card['seq']} ${reversed ? '逆位' : '正位'}\n`),
                        Plain(reversed ? card['reversed_meaning'] : card['meaning'])
                    ];
                    if (chat.isGroupChat()) {
                        message.unshift(Plain(`${chat.sender.memberName} 今天抽到的阿尔卡纳牌是:`));
                    }
                    await chat.send(message);
                });
        },
        disabled() {
            Program.delete('arcana');
        }
    }));
};
