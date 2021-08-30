"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimiterSpan = exports.Limiter = void 0;
var Limiter = /** @class */ (function () {
    function Limiter() {
        this.spanMap = new Map();
    }
    /** 获取指定账号的limiter */
    Limiter.getLimiter = function (id) {
        if (!Limiter.limiterMap.has(id))
            Limiter.limiterMap.set(id, new Limiter());
        return Limiter.limiterMap.get(id);
    };
    /**
     * 添加限制标签
     * @param name 标签名
     */
    Limiter.prototype.span = function (name) {
        if (!this.spanMap.has(name))
            this.spanMap.set(name, new LimiterSpan(name));
        return this.spanMap.get(name);
    };
    /**
     * 获取明天同一时刻的 Date 对象
     */
    Limiter.ONE_DAY = function () {
        var date = new Date();
        date.setDate(date.getDate() + 1);
        return date;
    };
    /**
     * 获取明天凌晨0点的 Date 对象
     */
    Limiter.TOMORROW = function () {
        var date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    };
    /**
     * 获取下周凌晨0点的 Date 对象
     */
    Limiter.NEXT_WEEK = function () {
        var date = new Date();
        date.setDate(date.getDate() + 7);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    };
    /**
     * 获取下个月凌晨0点的 Date 对象
     */
    Limiter.NEXT_MONTH = function () {
        var date = new Date();
        date.setMonth(date.getMonth() + 1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    };
    Limiter.limiterMap = new Map();
    return Limiter;
}());
exports.Limiter = Limiter;
var LimiterSpan = /** @class */ (function () {
    function LimiterSpan(name) {
        this._name = name;
        this._value = null;
        this._expire = null;
    }
    /**
     * 设置过期时间
     * @param time 过期时间
     */
    LimiterSpan.prototype.expire = function (time) {
        this._expire = time;
        return this;
    };
    /**
     * 获取保存值
     */
    LimiterSpan.prototype.get = function () {
        if (this._expire && new Date() > this._expire)
            this._value = null;
        return this._value;
    };
    /**
     * 设置保存值
     * @param value 保存值
     */
    LimiterSpan.prototype.set = function (value) {
        this._value = value;
    };
    return LimiterSpan;
}());
exports.LimiterSpan = LimiterSpan;
