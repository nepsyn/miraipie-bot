export class Limiter {
    spanMap: Map<string, LimiterSpan>;
    static limiterMap: Map<number, Limiter> = new Map();

    /** 获取指定账号的limiter */
    static getLimiter(id: number) {
        if (!Limiter.limiterMap.has(id)) Limiter.limiterMap.set(id, new Limiter());
        return Limiter.limiterMap.get(id);
    }

    private constructor() {
        this.spanMap = new Map();
    }

    /**
     * 添加限制标签
     * @param name 标签名
     */
    span(name: string): LimiterSpan {
        if (!this.spanMap.has(name)) this.spanMap.set(name, new LimiterSpan(name));
        return this.spanMap.get(name);
    }

    /**
     * 获取明天同一时刻的 Date 对象
     */
    static ONE_DAY(): Date {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date;
    }

    /**
     * 获取明天凌晨0点的 Date 对象
     */
    static TOMORROW(): Date {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    }

    /**
     * 获取下周凌晨0点的 Date 对象
     */
    static NEXT_WEEK(): Date {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    }

    /**
     * 获取下个月凌晨0点的 Date 对象
     */
    static NEXT_MONTH(): Date {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    }
}

export class LimiterSpan {
    _name: string;
    _value: any;
    _expire: Date;

    constructor(name: string) {
        this._name = name;
        this._value = null;
        this._expire = null;
    }

    /**
     * 设置过期时间
     * @param time 过期时间
     */
    expire(time: Date): this {
        this._expire = time;
        return this;
    }

    /**
     * 获取保存值
     */
    get(): any {
        if (this._expire && new Date() > this._expire) this._value = null;
        return this._value;
    }

    /**
     * 设置保存值
     * @param value 保存值
     */
    set(value: any) {
        this._value = value;
    }
}

