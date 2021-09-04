"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = exports.CommandManager = exports.Command = void 0;
var miraipie_1 = require("miraipie");
var Command = /** @class */ (function () {
    function Command(bin, parent) {
        if (parent === void 0) { parent = null; }
        this.bin = bin;
        this.parent = parent;
        this.subCommands = new Map();
        this._validators = [];
        this._aliases = [];
        this._description = '';
        this._usage = '';
        this._action = function () { return undefined; };
        this._hide = false;
    }
    /**
     * 添加子命令
     * @param bin 子命令
     * @example
     * // 添加子命令
     * new Command('npm').bin('install');
     */
    Command.prototype.command = function (bin) {
        var sub = this.subCommands.get(bin) || new Command(bin, this);
        this.subCommands.set(bin, sub);
        return sub;
    };
    /**
     * 添加一个触发验证器, 一般用于权限验证
     * @param validator 验证器
     * @example
     * // 只响应来自 123456 用户的指令
     * program.on((window, chain) => {
     *     return window.contact.id === 123456;
     * });
     */
    Command.prototype.on = function (validator) {
        this._validators.push(validator);
        return this;
    };
    /**
     * 指令处理器
     * @param callback
     * @example
     * // 回复参数列表给指令发送人
     * program.action(async (args, window) => {
     *     await window.send(args.toString());
     * });
     */
    Command.prototype.action = function (callback) {
        this._action = callback;
        return this;
    };
    Command.prototype.aliases = function (aliases) {
        var _a;
        if (aliases) {
            (_a = this._aliases).push.apply(_a, __spreadArray([], __read(aliases), false));
            return this;
        }
        else {
            return this._aliases;
        }
    };
    Command.prototype.description = function (description) {
        if (!!description) {
            this._description = description;
            return this;
        }
        else {
            return this._description;
        }
    };
    /** 在所有指令帮助中隐藏该指令 */
    Command.prototype.hideOnHelp = function () {
        this._hide = true;
        return this;
    };
    ;
    /** 获取指令帮助信息 */
    Command.prototype.help = function () {
        var e_1, _a;
        var helpText = this.description() + "\n" + this.usage();
        var subCommands = [];
        try {
            for (var _b = __values(this.subCommands.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var sub = _c.value;
                if (!sub._hide)
                    subCommands.push(sub.bin + "  -  " + sub.description());
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (subCommands.length > 0)
            helpText += "\n\n\u5B50\u547D\u4EE4:\n" + subCommands.join('\n');
        return helpText;
    };
    Command.prototype.usage = function (usage) {
        if (!!usage) {
            this._usage = usage;
            return this;
        }
        else {
            return this._usage || this.bin;
        }
    };
    Object.defineProperty(Command.prototype, "root", {
        /**
         * 获取根 program 对象
         */
        get: function () {
            return this.parent === null ? this.parent : this.parent.parent;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 验证通过
     * @param chat 聊天窗
     * @param chain 消息链
     */
    Command.prototype.validate = function (chat, chain) {
        return this._validators.map(function (v) { return v(chat, chain); }).every(function (valid) { return valid; });
    };
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
    Command.prototype.parse = function (args, chat, chain) {
        return __awaiter(this, void 0, void 0, function () {
            var flag, _a, _b, command, e_2_1;
            var e_2, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.validate(chat, chain))
                            return [2 /*return*/];
                        if (!(args.length > 0)) return [3 /*break*/, 11];
                        flag = true;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = __values(this.subCommands.values()), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        command = _b.value;
                        if (!(command.bin === args[0] || command.aliases().includes(args[0]))) return [3 /*break*/, 4];
                        flag = false;
                        return [4 /*yield*/, command.parse(args.slice(1), chat, chain)];
                    case 3:
                        _d.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        if (!flag) return [3 /*break*/, 10];
                        return [4 /*yield*/, this._action(args, chat, chain, this)];
                    case 9:
                        _d.sent();
                        _d.label = 10;
                    case 10: return [3 /*break*/, 13];
                    case 11: return [4 /*yield*/, this._action(args, chat, chain, this)];
                    case 12:
                        _d.sent();
                        _d.label = 13;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 查找 Command 结点
     * @param bins
     */
    Command.prototype.find = function (bins) {
        var e_3, _a;
        if (bins.length > 0) {
            try {
                for (var _b = __values(this.subCommands.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var command = _c.value;
                    if (command.bin === bins[0] || command.aliases().includes(bins[0])) {
                        return command.find(bins.slice(1));
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return this;
        }
        else {
            return this;
        }
    };
    return Command;
}());
exports.Command = Command;
var CommandManager = /** @class */ (function () {
    function CommandManager() {
        this.programs = new Map();
        this.prefix = '/';
    }
    /**
     * 设置指令前缀
     * @param prefix 指令前缀
     */
    CommandManager.prototype.setPrefix = function (prefix) {
        this.prefix = prefix;
        return this;
    };
    /**
     * 添加一条独立指令
     * @param bin 独立指令
     */
    CommandManager.prototype.program = function (bin) {
        var program = this.programs.get(bin) || new Command(bin, null);
        this.programs.set(bin, program);
        return program;
    };
    /**
     * 删除一条独立指令
     * @param bin 独立指令
     */
    CommandManager.prototype.delete = function (bin) {
        this.programs.delete(bin);
    };
    /**
     * 解析指令
     * @param command 指令内容
     * @param chat 聊天窗
     * @param chain 消息链
     */
    CommandManager.prototype.parse = function (command, chat, chain) {
        return __awaiter(this, void 0, void 0, function () {
            var args, _a, _b, command_1, e_4_1;
            var e_4, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        args = command.trim().split(/\s+/);
                        if (!(args.length > 0)) return [3 /*break*/, 8];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = __values(this.programs.values()), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        command_1 = _b.value;
                        if (!(command_1.bin === args[0] || command_1.aliases().includes(args[0]))) return [3 /*break*/, 4];
                        return [4 /*yield*/, command_1.parse(args.slice(1), chat, chain)];
                    case 3:
                        _d.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_4_1 = _d.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 查找 Command 结点
     * @param bins 指令分段
     */
    CommandManager.prototype.find = function (bins) {
        var e_5, _a;
        if (bins.length > 0) {
            try {
                for (var _b = __values(this.programs.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var command = _c.value;
                    if (command.bin === bins[0] || command.aliases().includes(bins[0])) {
                        return command.find(bins.slice(1));
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_5) throw e_5.error; }
            }
            return null;
        }
        else {
            return null;
        }
    };
    return CommandManager;
}());
exports.CommandManager = CommandManager;
exports.Program = new CommandManager();
module.exports = function (ctx) {
    ctx.pie((0, miraipie_1.makePie)({
        id: 'miraipie-command',
        name: 'miraipie简单命令解释器',
        version: '0.0.1',
        author: 'Nepsyn',
        configMeta: {
            prefix: {
                type: String,
                description: '指令执行的前缀',
                default: function () { return '/'; }
            }
        },
        data: {
            program: exports.Program
        },
        installed: function () {
            var _this = this;
            exports.Program.setPrefix(this.configs.prefix);
            exports.Program
                .program('help')
                .aliases(['帮助'])
                .description('显示帮助信息')
                .usage('help [command]')
                .action(function (args, chat, chain) { return __awaiter(_this, void 0, void 0, function () {
                var command, commands, _a, _b, program;
                var e_6, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!(args && args.length > 0)) return [3 /*break*/, 5];
                            command = exports.Program.find(args);
                            if (!command) return [3 /*break*/, 2];
                            return [4 /*yield*/, chat.send(command.help())];
                        case 1:
                            _d.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, chat.send("\u672A\u77E5\u7684\u547D\u4EE4, \u53D1\u9001 " + this.configs.prefix + "help \u67E5\u770B\u6240\u6709\u6307\u4EE4")];
                        case 3:
                            _d.sent();
                            _d.label = 4;
                        case 4: return [3 /*break*/, 7];
                        case 5:
                            commands = [];
                            try {
                                for (_a = __values(exports.Program.programs.values()), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    program = _b.value;
                                    if (program.validate(chat, chain) && !program._hide) {
                                        commands.push("" + exports.Program.prefix + program.usage() + "  -  " + program.description());
                                    }
                                }
                            }
                            catch (e_6_1) { e_6 = { error: e_6_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_6) throw e_6.error; }
                            }
                            return [4 /*yield*/, chat.send("\u5F53\u524D\u52A0\u8F7D\u7684\u547D\u4EE4\u5217\u8868:\n" + commands.join('\n'))];
                        case 6:
                            _d.sent();
                            _d.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            }); });
        },
        received: function (chat, chain) {
            return __awaiter(this, void 0, void 0, function () {
                var command, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            command = chain.selected('Plain').toDisplayString().trim();
                            if (!command.startsWith(exports.Program.prefix)) return [3 /*break*/, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.program.parse(command.slice(this.configs.prefix.length), chat, chain)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            this.logger.error("\u5904\u7406\u547D\u4EE4 " + command + " \u51FA\u9519:", err_1.message);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    }));
};
module.exports.Program = exports.Program;
