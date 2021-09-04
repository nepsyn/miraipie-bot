import {Chat, makePie, MessageChain, MiraiPieApplication} from 'miraipie';

/** 指令验证器 */
type Validator = (chat: Chat, chain: MessageChain) => boolean;
/** 指令处理器 */
type Action = (args: string[], chat: Chat, chain: MessageChain, command: Command) => any;

export class Command {
    subCommands: Map<string, Command>;
    _validators: Validator[];
    _aliases: string[];
    _description: string;
    _usage: string;
    _action: Action;
    _hide: boolean;

    constructor(public bin: string, public parent: Command = null) {
        this.subCommands = new Map();
        this._validators = [];
        this._aliases = [];
        this._description = '';
        this._usage = '';
        this._action = () => undefined;
        this._hide = false;
    }

    /**
     * 添加子命令
     * @param bin 子命令
     * @example
     * // 添加子命令
     * new Command('npm').bin('install');
     */
    command(bin: string): Command {
        const sub = this.subCommands.get(bin) || new Command(bin, this);
        this.subCommands.set(bin, sub);
        return sub;
    }

    /**
     * 添加一个触发验证器, 一般用于权限验证
     * @param validator 验证器
     * @example
     * // 只响应来自 123456 用户的指令
     * program.on((window, chain) => {
     *     return window.contact.id === 123456;
     * });
     */
    on(validator: Validator): this {
        this._validators.push(validator);
        return this;
    }

    /**
     * 指令处理器
     * @param callback
     * @example
     * // 回复参数列表给指令发送人
     * program.action(async (args, window) => {
     *     await window.send(args.toString());
     * });
     */
    action(callback: Action): this {
        this._action = callback;
        return this;
    }

    /**
     * 指令别名
     * @param aliases 别名列表, 不填则返回别名列表
     * @example
     * // 为指令添加别名
     * new Command('update').aliases('u', 'upgrade');
     */
    aliases(aliases: string[]): this;
    aliases(): string[];
    aliases(aliases?: string[]): this | string[] {
        if (aliases) {
            this._aliases.push(...aliases);
            return this;
        } else {
            return this._aliases;
        }
    }

    /**
     * 获取或设置指令描述
     * @param description 设置的指令描述内容, 不填则返回描述内容
     * @example
     * // 设置描述
     * program.description('test program');
     * // "test program"
     * console.log(program.description());
     */
    description(description: string): this;
    description(): string;
    description(description?: string): this | string {
        if (!!description) {
            this._description = description;
            return this;
        } else {
            return this._description;
        }
    }

    /** 在所有指令帮助中隐藏该指令 */
    hideOnHelp(): this {
        this._hide = true;
        return this;
    };

    /** 获取指令帮助信息 */
    help(): string {
        let helpText = `${this.description()}\n${this.usage()}`
        const subCommands = [];
        for (const sub of this.subCommands.values()) {
            if (!sub._hide) subCommands.push(`${sub.bin}  -  ${sub.description()}`);
        }
        if (subCommands.length > 0) helpText += `\n\n子命令:\n${subCommands.join('\n')}`;
        return helpText;
    }

    /**
     * 获取或设置指令使用说明
     * @param usage 设置的指令使用说明, 不填则返回使用说明
     * @example
     * // 设置使用说明
     * program.usage('mv <source> <dest>');
     * // "mv <source> <dest>"
     * console.log(program.usage());
     */
    usage(usage: string): this;
    usage(): string;
    usage(usage?: string): this | string {
        if (!!usage) {
            this._usage = usage;
            return this;
        } else {
            return this._usage || this.bin;
        }
    }

    /**
     * 获取根 program 对象
     */
    get root(): Command {
        return this.parent === null ? this.parent : this.parent.parent;
    }

    /**
     * 验证通过
     * @param chat 聊天窗
     * @param chain 消息链
     */
    validate(chat: Chat, chain: MessageChain): boolean {
        return this._validators.map((v) => v(chat, chain)).every((valid) => valid);
    }

    /**
     * 解析指令参数
     * @param args 指令的参数列表
     * @param chat 聊天窗
     * @param chain 消息链
     * @example
     * program.parse(['hello', 'world'], {
     *     foo: 'bar'
     * });
     */
    async parse(args: string[], chat: Chat, chain: MessageChain) {
        if (!this.validate(chat, chain)) return;
        if (args.length > 0) {
            let flag = true;
            for (const command of this.subCommands.values()) {
                if (command.bin === args[0] || command.aliases().includes(args[0])) {
                    flag = false;
                    await command.parse(args.slice(1), chat, chain);
                    break;
                }
            }
            if (flag) await this._action(args, chat, chain, this);
        } else {
            await this._action(args, chat, chain, this);
        }
    }

    /**
     * 查找 Command 结点
     * @param bins
     */
    find(bins: string[]): Command {
        if (bins.length > 0) {
            for (const command of this.subCommands.values()) {
                if (command.bin === bins[0] || command.aliases().includes(bins[0])) {
                    return command.find(bins.slice(1));
                }
            }
            return this;
        } else {
            return this;
        }
    }
}

export class CommandManager {
    programs: Map<string, Command>;
    prefix: string;

    constructor() {
        this.programs = new Map();
        this.prefix = '/';
    }

    /**
     * 设置指令前缀
     * @param prefix 指令前缀
     */
    setPrefix(prefix: string): this {
        this.prefix = prefix;
        return this;
    }

    /**
     * 添加一条独立指令
     * @param bin 独立指令
     */
    program(bin: string): Command {
        const program = this.programs.get(bin) || new Command(bin, null);
        this.programs.set(bin, program);
        return program;
    }

    /**
     * 删除一条独立指令
     * @param bin 独立指令
     */
    delete(bin: string) {
        this.programs.delete(bin);
    }

    /**
     * 解析指令
     * @param command 指令内容
     * @param chat 聊天窗
     * @param chain 消息链
     */
    async parse(command: string, chat: Chat, chain: MessageChain) {
        const args = command.trim().split(/\s+/);
        if (args.length > 0) {
            for (const command of this.programs.values()) {
                if (command.bin === args[0] || command.aliases().includes(args[0])) {
                    await command.parse(args.slice(1), chat, chain);
                    break;
                }
            }
        }
    }

    /**
     * 查找 Command 结点
     * @param bins 指令分段
     */
    find(bins: string[]): Command {
        if (bins.length > 0) {
            for (const command of this.programs.values()) {
                if (command.bin === bins[0] || command.aliases().includes(bins[0])) {
                    return command.find(bins.slice(1));
                }
            }
            return null;
        } else {
            return null;
        }
    }
}

export const Program = new CommandManager();

module.exports = (ctx: MiraiPieApplication) => {
    ctx.pie(makePie({
        id: 'miraipie-command',
        name: 'miraipie简单命令解释器',
        version: '0.0.1',
        author: 'Nepsyn',
        configMeta: {
            prefix: {
                type: String,
                description: '指令执行的前缀',
                default: () => '/'
            }
        },
        data: {
            program: Program
        },
        installed() {
            Program.setPrefix(this.configs.prefix);
            Program
                .program('help')
                .aliases(['帮助'])
                .description('显示帮助信息')
                .usage('help [command]')
                .action(async (args, chat, chain) => {
                    if (args && args.length > 0) {
                        const command = Program.find(args);
                        if (command) {
                            await chat.send(command.help());
                        } else {
                            await chat.send(`未知的命令, 发送 ${this.configs.prefix}help 查看所有指令`);
                        }
                    } else {
                        const commands = [];
                        for (const program of Program.programs.values()) {
                            if (program.validate(chat, chain) && !program._hide) {
                                commands.push(`${Program.prefix}${program.usage()}  -  ${program.description()}`)
                            }
                        }
                        await chat.send(`当前加载的命令列表:\n${commands.join('\n')}`);
                    }
                });
        },
        async received(chat, chain) {
            const command = chain.selected('Plain').toDisplayString().trim();
            if (command.startsWith(Program.prefix)) {
                try {
                    await this.program.parse(command.slice(this.configs.prefix.length), chat, chain);
                } catch (err) {
                    this.logger.error(`处理命令 ${command} 出错:`, err.message);
                }
            }
        }
    }));
};

module.exports.Program = Program;
