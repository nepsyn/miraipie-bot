const axios = require('axios');
const {makePie} = require('miraipie');
const {Program} = require('../command');

const languages = [
    'assembly', 'ats', 'bash', 'c', 'clojure', 'cobol',
    'coffeescript', 'cpp', 'crystal', 'csharp', 'd', 'elixir', 'elm',
    'erlang', 'fsharp', 'go', 'groovy', 'haskell', 'idris',
    'java', 'javascript', 'julia', 'kotlin', 'lua', 'mercury',
    'nim', 'ocaml', 'perl', 'perl6', 'php', 'python', 'ruby',
    'rust', 'scala', 'swift', 'typescript'
];

module.exports = (ctx) => {
    ctx.pie(makePie({
        id: 'runner',
        name: '在线执行代码',
        version: '0.0.1',
        author: 'Nepsyn',
        configMeta: {
            token: {
                type: String,
                description: 'glot提供的token',
                required: true
            }
        },
        enabled() {
            Program
                .program('run')
                .aliases(['test', 'glot'])
                .description('在线执行代码片段')
                .usage('run <language> <code>')
                .on((chat) => !chat.isGroupChat())
                .action(async (args, chat, chain) => {
                    const command = chain.toDisplayString().slice(Program.prefix.length);
                    const match = command.match(/^\w+\s+(.*?)\s+(.*)$/);
                    if (match) {
                        const lan = match[1];
                        const code = match[2];

                        if (!languages.includes(lan)) {
                            await chat.send(`不支持的语言: ${lan}\n支持的语言列表: ${languages}`);
                            return;
                        }

                        const url = `https://run.glot.io/languages/${lan}/latest`
                        const data = {
                            'files': [{'name': 'Test', 'content': code}]
                        }
                        const headers = {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${this.configs.token}`
                        };

                        const resp = (await axios.post(url, data, { headers })).data;
                        if (resp['stderr'] || resp['error']) {
                            await chat.send(`执行出错:\n${resp['stderr']}${resp['error']}`);
                        } else {
                            await chat.send(`执行结果:\n${resp['stdout']}`)
                        }
                    }
                });
        },
        disabled() {
            Program.delete('run');
        }
    }));
};
