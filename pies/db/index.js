"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.Sqlite3Adapter = exports.DatabaseAdapter = void 0;
var better_sqlite3_1 = __importDefault(require("better-sqlite3"));
var miraipie_1 = require("miraipie");
var path = __importStar(require("path"));
/**
 * 转化日期对象为字符串
 */
function formatDate(date) {
    if (!date)
        return null;
    return date.getUTCFullYear() + "-" +
        ((date.getMonth() + 1).toString().padStart(2, '0') + "-") +
        (date.getDate().toString().padStart(2, '0') + " ") +
        (date.getHours().toString().padStart(2, '0') + ":") +
        (date.getMinutes().toString().padEnd(2, '0') + ":") +
        ("" + date.getSeconds().toString().padStart(2, '0'));
}
/**
 * 数据库adapter
 */
var DatabaseAdapter = /** @class */ (function () {
    function DatabaseAdapter() {
    }
    return DatabaseAdapter;
}());
exports.DatabaseAdapter = DatabaseAdapter;
var Sqlite3Adapter = /** @class */ (function (_super) {
    __extends(Sqlite3Adapter, _super);
    function Sqlite3Adapter(path) {
        var _this = _super.call(this) || this;
        _this.path = path;
        _this.type = 'Sqlite3Adapter';
        _this.database = (0, better_sqlite3_1.default)(path, {
            fileMustExist: true
        });
        return _this;
    }
    Object.defineProperty(Sqlite3Adapter.prototype, "open", {
        get: function () {
            return this.database && this.database.open;
        },
        enumerable: false,
        configurable: true
    });
    Sqlite3Adapter.prototype.close = function () {
        var _a;
        (_a = this.database) === null || _a === void 0 ? void 0 : _a.close();
        this.database = null;
    };
    Sqlite3Adapter.prototype.saveMessage = function (record) {
        var _a;
        var resp = (_a = this.database) === null || _a === void 0 ? void 0 : _a.prepare('INSERT INTO message (id, content, from_id, to_id, type) VALUES ($sourceId, $content, $fromId, $toId, $type)').run({
            sourceId: record.sourceId,
            content: JSON.stringify(miraipie_1.MessageChain.from(record.messageChain).dropped('Source')),
            fromId: record.from,
            toId: record.to,
            type: record.type
        });
        return (resp === null || resp === void 0 ? void 0 : resp.changes) > 0;
    };
    Sqlite3Adapter.prototype.getMessageById = function (messageId) {
        var record = this.database
            .prepare('SELECT id sourceId, content messageChain, from_id [from], to_id [to], type, timestamp time FROM message WHERE id=?')
            .get(messageId);
        if (record) {
            record.messageChain = miraipie_1.MessageChain.from(JSON.parse(record.messageChain));
            record.time = new Date(record.time);
        }
        return record;
    };
    Sqlite3Adapter.prototype.queryMessages = function (conditions) {
        var e_1, _a;
        var _b;
        if (conditions === void 0) { conditions = {}; }
        var sql = 'SELECT id sourceId, content messageChain, from_id [from], to_id [to], type, timestamp time FROM message';
        var queries = [];
        if (conditions.from)
            queries.push('from_id=$from');
        if (conditions.to)
            queries.push('to_id=$to');
        if (conditions.type)
            queries.push('type=$type');
        if (conditions.timeStart)
            queries.push('timestamp>=$timeStart');
        if (conditions.timeEnd)
            queries.push('timestamp<=$timeEnd');
        if (queries.length > 0)
            sql += (' WHERE ' + queries.join(' AND '));
        var records = (_b = this.database) === null || _b === void 0 ? void 0 : _b.prepare(sql).all(__assign(__assign({}, conditions), { timeStart: formatDate(conditions === null || conditions === void 0 ? void 0 : conditions.timeStart), timeEnd: formatDate(conditions === null || conditions === void 0 ? void 0 : conditions.timeEnd) }));
        try {
            for (var records_1 = __values(records), records_1_1 = records_1.next(); !records_1_1.done; records_1_1 = records_1.next()) {
                var record = records_1_1.value;
                record.messageChain = miraipie_1.MessageChain.from(JSON.parse(record.messageChain));
                record.time = new Date(record.time);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (records_1_1 && !records_1_1.done && (_a = records_1.return)) _a.call(records_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return records;
    };
    Sqlite3Adapter.prototype.saveEvent = function (record) {
        var _a;
        var resp = (_a = this.database) === null || _a === void 0 ? void 0 : _a.prepare('INSERT INTO event (content, type) VALUES ($content, $type)').run({
            content: JSON.stringify(record.event),
            type: record.type
        });
        return (resp === null || resp === void 0 ? void 0 : resp.changes) > 0;
    };
    Sqlite3Adapter.prototype.queryEvents = function (conditions) {
        var e_2, _a;
        var _b;
        if (conditions === void 0) { conditions = {}; }
        var sql = 'SELECT content event, type, timestamp time FROM event';
        var queries = [];
        if (conditions.type)
            queries.push('type=$type');
        if (conditions.timeStart)
            queries.push('timestamp>=$timeStart');
        if (conditions.timeEnd)
            queries.push('timestamp<=$timeEnd');
        if (queries.length > 0)
            sql += (' WHERE ' + queries.join(' AND '));
        var records = (_b = this.database) === null || _b === void 0 ? void 0 : _b.prepare(sql).all(__assign(__assign({}, conditions), { timeStart: formatDate(conditions === null || conditions === void 0 ? void 0 : conditions.timeStart), timeEnd: formatDate(conditions === null || conditions === void 0 ? void 0 : conditions.timeEnd) }));
        try {
            for (var records_2 = __values(records), records_2_1 = records_2.next(); !records_2_1.done; records_2_1 = records_2.next()) {
                var record = records_2_1.value;
                record.event = JSON.parse(record.event);
                record.time = new Date(record.time);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (records_2_1 && !records_2_1.done && (_a = records_2.return)) _a.call(records_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return records;
    };
    Sqlite3Adapter.prototype.clearMessageHistory = function (days) {
        var _a, _b;
        return (_b = (_a = this.database) === null || _a === void 0 ? void 0 : _a.prepare("DELETE FROM message WHERE JULIANDAY(DATETIME('now', 'localtime'))-JULIANDAY(DATETIME(timestamp))>?").run(days)) === null || _b === void 0 ? void 0 : _b.changes;
    };
    Sqlite3Adapter.prototype.clearEventHistory = function (days) {
        var _a, _b;
        return (_b = (_a = this.database) === null || _a === void 0 ? void 0 : _a.prepare("DELETE FROM event WHERE JULIANDAY(DATETIME('now', 'localtime'))-JULIANDAY(DATETIME(timestamp))>?").run(days)) === null || _b === void 0 ? void 0 : _b.changes;
    };
    return Sqlite3Adapter;
}(DatabaseAdapter));
exports.Sqlite3Adapter = Sqlite3Adapter;
exports.db = new Sqlite3Adapter(path.join(process.cwd(), 'miraipie.db'));
module.exports = function (ctx) {
    ctx.on('message', function (chatMessage) {
        exports.db.saveMessage({
            sourceId: miraipie_1.MessageChain.from(chatMessage.messageChain).sourceId,
            messageChain: chatMessage.messageChain,
            type: chatMessage.type,
            from: chatMessage.sender.id,
            to: chatMessage.type === 'GroupMessage' ? chatMessage.sender.group.id : ctx.qq
        });
    });
    ctx.on('event', function (event) {
        exports.db.saveEvent({
            type: event.type,
            event: event,
        });
    });
};
module.exports.db = exports.db;
