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
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = require("../command");
var miraipie_1 = require("miraipie");
var dictionary = require('./dictionary.json');
var allWords = Object.keys(dictionary);
var RaceGame = /** @class */ (function () {
    function RaceGame(chat, onOver, term) {
        if (term === void 0) { term = 10; }
        this.chat = chat;
        this.onOver = onOver;
        this.term = term;
        this.words = allWords.concat([]).sort(function () { return 0.5 - Math.random(); });
        this.round = 0;
        this.score = new Map();
        this.midfield = false;
    }
    Object.defineProperty(RaceGame.prototype, "currentWord", {
        get: function () {
            return this.words[this.round - 1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RaceGame.prototype, "isOver", {
        get: function () {
            return this.round > this.term;
        },
        enumerable: false,
        configurable: true
    });
    RaceGame.prototype.cancel = function () {
        if (this.timeout)
            clearTimeout(this.timeout);
        this.round = this.term;
    };
    RaceGame.prototype.next = function (immediate) {
        if (immediate === void 0) { immediate = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!immediate) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.chat.send('3s后开启下一轮')];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.timeout = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.chat.send("\u63D0\u793A\uFF1A\u8BE5\u5355\u8BCD\u7684\u7B2C\u4E00\u4E2A\u5B57\u6BCD\u662F " + this.currentWord[0])];
                                    case 1:
                                        _a.sent();
                                        this.timeout = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                            var _this = this;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, this.chat.send("\u63D0\u793A\uFF1A\u8BE5\u5355\u8BCD\u7684\u53D1\u97F3\u662F /" + dictionary[this.currentWord].phone + "/")];
                                                    case 1:
                                                        _a.sent();
                                                        this.timeout = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, this.chat.send("30s\u5185\u6CA1\u6709\u4EBA\u7B54\u51FA\u6B63\u786E\u7B54\u6848\uFF1A " + this.currentWord)];
                                                                    case 1:
                                                                        _a.sent();
                                                                        this.round--;
                                                                        this.words.splice(this.round, 1);
                                                                        return [4 /*yield*/, this.next()];
                                                                    case 2:
                                                                        _a.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); }, 10000);
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }, 10000);
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 10000);
                        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!this.isOver) return [3 /*break*/, 2];
                                        this.midfield = false;
                                        this.round++;
                                        return [4 /*yield*/, this.chat.send([
                                                (0, miraipie_1.Plain)("\u7B2C(" + this.round + "/" + this.term + ")\u5C40\uFF0C\u65F6\u9650\uFF1A30s\n"),
                                                (0, miraipie_1.Plain)(dictionary[this.currentWord].trans.map(function (tr) { return "[" + tr.pos + "] " + tr.tranCn; }).join('\n') + '\n'),
                                                (0, miraipie_1.Plain)("\u8BE5\u5355\u8BCD\u6709" + this.currentWord.length + "\u4E2A\u5B57\u6BCD"),
                                            ])];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); }, immediate ? 0 : 3000);
                        return [2 /*return*/];
                }
            });
        });
    };
    RaceGame.prototype.over = function () {
        return __awaiter(this, void 0, void 0, function () {
            var score, members, scoreMap, chain;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        score = Array.from(this.score.entries());
                        return [4 /*yield*/, this.chat.getMemberList()];
                    case 1:
                        members = _a.sent();
                        scoreMap = score.map(function (s) { return [members.find(function (m) { return m.id === s[0]; }).memberName, s[1]]; });
                        scoreMap.sort(function (a, b) { return a[0] < b[0] ? 1 : -1; });
                        chain = [(0, miraipie_1.Plain)('游戏结束，成绩排名：\n')];
                        if (scoreMap.length > 0)
                            chain.push((0, miraipie_1.Plain)("\uD83E\uDD47 " + scoreMap[0][0] + " - " + scoreMap[0][1]));
                        if (scoreMap.length > 1)
                            chain.push((0, miraipie_1.Plain)("\n\uD83E\uDD48 " + scoreMap[1][0] + " - " + scoreMap[1][1]));
                        if (scoreMap.length > 2)
                            chain.push((0, miraipie_1.Plain)("\n\uD83E\uDD49 " + scoreMap[2][0] + " - " + scoreMap[2][1]));
                        if (scoreMap.length > 3)
                            chain.push((0, miraipie_1.Plain)("\n4\uFE0F\u20E3 " + scoreMap[3][0] + " - " + scoreMap[3][1]));
                        if (scoreMap.length > 4)
                            chain.push((0, miraipie_1.Plain)("\n5\uFE0F\u20E3 " + scoreMap[4][0] + " - " + scoreMap[4][1]));
                        return [4 /*yield*/, this.chat.send(chain)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.onOver()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RaceGame.prototype.validate = function (chat, chain) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.midfield && !this.isOver)) return [3 /*break*/, 6];
                        if (!(chain.selected('Plain').toDisplayString().trim() === this.words[this.round - 1])) return [3 /*break*/, 6];
                        this.score.set(chat.sender.id, (this.score.get(chat.sender.id) || 0) + 1);
                        return [4 /*yield*/, chat.send([(0, miraipie_1.At)(chat.sender.id), (0, miraipie_1.Plain)(" \u56DE\u7B54\u6B63\u786E\uFF01\u79EF\u5206+1\uFF0C\u5F53\u524D\u5171" + this.score.get(chat.sender.id) + "\u5206")])];
                    case 1:
                        _a.sent();
                        this.midfield = true;
                        if (this.timeout)
                            clearTimeout(this.timeout);
                        if (!(this.round < this.term)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.next()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.over()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return RaceGame;
}());
module.exports = function (ctx) {
    ctx.pie((0, miraipie_1.makePie)({
        id: 'dict',
        name: '背单词',
        version: '0.0.1',
        author: 'Nepsyn',
        data: {
            dictionary: dictionary,
            games: new Map()
        },
        filters: [miraipie_1.PieFilter.fromGroup],
        received: function (chat, chain) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.games.has(chat.contact.id)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.games.get(chat.contact.id).validate(chat, chain)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        },
        enabled: function () {
            var _this = this;
            var dict = command_1.Program
                .program('dict')
                .aliases(['单词', '辞书', '词典'])
                .description('简单背单词工具')
                .usage('dict <command> [...args]');
            dict
                .command('search')
                .aliases(['s', '搜索'])
                .usage('dict search <word>')
                .description('搜索单词')
                .action(function (args, chat, chain, command) { return __awaiter(_this, void 0, void 0, function () {
                var word, info;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(args.length < 1)) return [3 /*break*/, 2];
                            return [4 /*yield*/, chat.send(command.help())];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                        case 2:
                            word = args[0];
                            if (!(word in this.dictionary)) return [3 /*break*/, 4];
                            info = this.dictionary[word];
                            return [4 /*yield*/, chat.send(word + " /" + info.phone + "/\n" + info.trans.map(function (tr) { return "[" + tr.pos + "] " + tr.tranCn; }).join('\n'))];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, chat.send("\u6CA1\u6709\u627E\u5230\u5355\u8BCD: " + word)];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
            var race = dict
                .command('race')
                .aliases(['r', '竞赛'])
                .on(function (chat) { return chat.isGroupChat(); })
                .usage('dict race [term]\nterm为局数, 默认十局')
                .description('开启群内单词竞赛')
                .action(function (args, chat) { return __awaiter(_this, void 0, void 0, function () {
                var game;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.games.has(chat.contact.id)) return [3 /*break*/, 3];
                            game = new RaceGame(chat, function () {
                                _this.games.delete(chat.contact.id);
                            }, parseInt(args[0]) || 10);
                            this.games.set(chat.contact.id, game);
                            return [4 /*yield*/, chat.send("\u5355\u8BCD\u7ADE\u8D5B\u6E38\u620F\u5F00\u59CB, \u53D1\u9001" + command_1.Program.prefix + "dict race cancel\u53EF\u4EE5\u7ACB\u5373\u53D6\u6D88\u5DF2\u5F00\u59CB\u7684\u6E38\u620F")];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, game.next(true)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            race
                .command('cancel')
                .aliases(['c', '取消'])
                .on(function (chat) { return chat.isGroupChat(); })
                .usage('dict race cancel\nterm为局数, 默认十局')
                .description('取消已开始的单词竞赛')
                .action(function (args, chat) { return __awaiter(_this, void 0, void 0, function () {
                var game;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.games.has(chat.contact.id)) return [3 /*break*/, 2];
                            game = this.games.get(chat.contact.id);
                            game.cancel();
                            this.games.delete(chat.contact.id);
                            return [4 /*yield*/, chat.send('已取消竞赛')];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, chat.send('没有正在进行中的竞赛')];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        }
    }));
};
