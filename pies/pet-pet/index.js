const {makePie, makeImage} = require('miraipie');
const {Program} = require('../command');
const {Limiter} = require('../limiter');
const pet = require('pet-pet-gif');
const canvas = require('canvas');

module.exports = (ctx) => {
    ctx.pie(makePie({
        id: 'pet-pet',
        name: '搓头像',
        version: '0.0.1',
        author: 'Nepsyn',
        enabled() {
            Program
                .program('rua')
                .aliases(['搓', '搓头'])
                .description('搓搓头')
                .usage('rua [@某人]')
                .action(async (args, chat, chain) => {
                    let target;
                    if (chat.isGroupChat()) {
                        /** @type {At[]} */
                        const ats = chain.selected('At');
                        if (ats.length === 1) target = ats[0].target;
                        else target = chat.sender.id;
                    } else {
                        target = chat.sender.id;
                    }
                    const span = Limiter.getLimiter(target).span('pet-pet');
                    if (!span.get()) {
                        const avatar = await canvas.loadImage(`https://q1.qlogo.cn/g?b=qq&nk=${target}&s=640`);
                        const round = canvas.createCanvas(200, 200);
                        const ctx = round.getContext('2d');
                        ctx.beginPath();
                        ctx.arc(100, 100, 100, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.clip();
                        ctx.drawImage(avatar, 0, 0, 200, 200);
                        span.set((await pet(round.toBuffer(), {delay: 20})).toString('base64'));
                    }
                    await chat.send(makeImage({base64: span.get()}), chain.sourceId);
                });
        },
        disabled() {
            Program.delete('rua');
        }
    }));
};
