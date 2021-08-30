"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancel = exports.cron = void 0;
var node_schedule_1 = __importDefault(require("node-schedule"));
var scheduleMap = new Map();
/**
 * 添加定时事件<br/>
 * @see <a href="https://www.npmjs.com/package/node-schedule">node-schedule文档</a>
 * @param id 定时事件id, 用于取消事件
 * @param expression cron表达式
 * @param callback 定时执行的任务
 * @return node-schedule返回的Job对象
 * @example
 * // 每天早上9点在控制台打印一句亲切的问候
 * cron('greet', '9 * * *', () => {
 *     console.log('Good morning!');
 * });
 */
function cron(id, expression, callback) {
    var job = node_schedule_1.default.scheduleJob(expression, callback);
    if (!job)
        return null;
    job.on('canceled', function () {
        scheduleMap.delete(id);
    });
    scheduleMap.set(id, job);
    return job;
}
exports.cron = cron;
/**
 * 删除定时事件
 * @param id 定时事件id
 * @example
 * // 每天早上8点的闹钟
 * cron('alert', '8 * * *', () => {
 *     console.log('WAKE UP!');
 * });
 * // 明天是周末, 不用早起
 * cancel('alert');
 */
function cancel(id) {
    var job = scheduleMap.get(id);
    if (job)
        job.cancel();
}
exports.cancel = cancel;
