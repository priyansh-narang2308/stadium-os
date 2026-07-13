declare module '@upstash/redis' {
  export class Redis {
    constructor(config: { url: string; token: string });
    get(key: string): Promise<unknown>;
    set(key: string, value: unknown, options?: { ex?: number }): Promise<void>;
    setex(key: string, seconds: number, value: string): Promise<void>;
    incr(key: string): Promise<number>;
    del(key: string): Promise<number>;
    keys(pattern: string): Promise<string[]>;
    flushall(): Promise<void>;
  }
}
