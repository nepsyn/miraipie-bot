import { Chat, MessageChain } from 'miraipie';
/** 指令验证器 */
declare type Validator = (chat: Chat, chain: MessageChain) => boolean;
/** 指令处理器 */
declare type Action = (args: string[], chat: Chat, chain: MessageChain, program: Command) => any;
export declare class Command {
    bin: string;
    parent: Command;
    subCommands: Map<string, Command>;
    _validators: Validator[];
    _aliases: string[];
    _description: string;
    _usage: string;
    _action: Action;
    _hide: boolean;
    constructor(bin: string, parent?: Command);
    /**
     * 添加子命令
     * @param bin 子命令
     * @example
     * // 添加子命令
     * new Command('npm').bin('install');
     */
    command(bin: string): Command;
    /**
     * 添加一个触发验证器, 一般用于权限验证
     * @param validator 验证器
     * @example
     * // 只响应来自 123456 用户的指令
     * program.on((window, chain) => {
     *     return window.contact.id === 123456;
     * });
     */
    on(validator: Validator): this;
    /**
     * 指令处理器
     * @param callback
     * @example
     * // 回复参数列表给指令发送人
     * program.action(async (args, window) => {
     *     await window.send(args.toString());
     * });
     */
    action(callback: Action): this;
    /**
     * 指令别名
     * @param aliases 别名列表, 不填则返回别名列表
     * @example
     * // 为指令添加别名
     * new Command('update').aliases('u', 'upgrade');
     */
    aliases(aliases: string[]): this;
    aliases(): string[];
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
    /** 在所有指令帮助中隐藏该指令 */
    hideOnHelp(): this;
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
    /**
     * 获取根 program 对象
     */
    get root(): Command;
    /**
     * 验证通过
     * @param chat 聊天窗
     * @param chain 消息链
     */
    validate(chat: Chat, chain: MessageChain): boolean;
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
    parse(args: string[], chat: Chat, chain: MessageChain): Promise<void>;
    /**
     * 查找 Command 结点
     * @param bins
     */
    find(bins: string[]): Command;
}
export declare class CommandManager {
    programs: Map<string, Command>;
    prefix: string;
    constructor();
    /**
     * 设置指令前缀
     * @param prefix 指令前缀
     */
    setPrefix(prefix: string): this;
    /**
     * 添加一条独立指令
     * @param bin 独立指令
     */
    program(bin: string): Command;
    /**
     * 删除一条独立指令
     * @param bin 独立指令
     */
    delete(bin: string): void;
    /**
     * 解析指令
     * @param command 指令内容
     * @param chat 聊天窗
     * @param chain 消息链
     */
    parse(command: string, chat: Chat, chain: MessageChain): Promise<void>;
    /**
     * 查找 Command 结点
     * @param bins 指令分段
     */
    find(bins: string[]): Command;
}
export declare const Program: CommandManager;
export {};
