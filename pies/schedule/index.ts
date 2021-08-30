import schedule from 'node-schedule';

const scheduleMap: Map<string, schedule.Job> = new Map();

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
export function cron(id: string, expression: string | Date | object, callback: Function) {
    const job = schedule.scheduleJob(expression, callback);
    if (!job) return null;
    job.on('canceled', () => {
        scheduleMap.delete(id);
    });
    scheduleMap.set(id, job);
    return job;
}
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
export function cancel(id: string) {
    const job = scheduleMap.get(id);
    if (job) job.cancel();
}
