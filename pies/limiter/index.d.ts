export declare class Limiter {
    spanMap: Map<string, LimiterSpan>;
    static limiterMap: Map<number, Limiter>;
    /** 获取指定账号的limiter */
    static getLimiter(id: number): Limiter;
    private constructor();
    /**
     * 添加限制标签
     * @param name 标签名
     */
    span(name: string): LimiterSpan;
    /**
     * 获取明天同一时刻的 Date 对象
     */
    static ONE_DAY(): Date;
    /**
     * 获取明天凌晨0点的 Date 对象
     */
    static TOMORROW(): Date;
    /**
     * 获取下周凌晨0点的 Date 对象
     */
    static NEXT_WEEK(): Date;
    /**
     * 获取下个月凌晨0点的 Date 对象
     */
    static NEXT_MONTH(): Date;
}
export declare class LimiterSpan {
    _name: string;
    _value: any;
    _expire: Date;
    constructor(name: string);
    /**
     * 设置过期时间
     * @param time 过期时间
     */
    expire(time: Date): this;
    /**
     * 获取保存值
     */
    get(): any;
    /**
     * 设置保存值
     * @param value 保存值
     */
    set(value: any): void;
}
