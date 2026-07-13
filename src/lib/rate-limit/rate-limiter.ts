import { logger } from '../logger';

const MAX_MAP_SIZE = 100_000;
const CLEANUP_INTERVAL_MS = 300_000;

type SetOptions = Record<string, unknown>;

interface RedisStore {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: unknown, options?: SetOptions) => Promise<unknown>;
  incr: (key: string) => Promise<number>;
  del: (key: string) => Promise<number>;
  expire?: (key: string, seconds: number) => Promise<number>;
}

export class RateLimiter {
  private store?: RedisStore;
  private buckets: Map<string, { count: number; resetTime: number }> = new Map();
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    if (typeof setInterval !== 'undefined') {
      this.cleanupTimer = setInterval(() => this.cleanup(), CLEANUP_INTERVAL_MS);
    }
    this.initializeStore();
  }

  private async initializeStore(): Promise<void> {
    try {
      const redisUrl = process.env.UPSTASH_REDIS_URL;
      const redisToken = process.env.UPSTASH_REDIS_TOKEN;
      if (redisUrl && redisToken) {
        const { Redis } = await import('@upstash/redis');
        this.store = new Redis({ url: redisUrl, token: redisToken }) as unknown as RedisStore;
        logger.info('Redis-backed rate limiter initialized');
      } else {
        logger.warn('Redis not configured, using in-memory implementation');
      }
    } catch (error) {
      logger.error('Failed to initialize store', error as Error);
    }
  }

  async consume(
    identifier: string,
    limit: number,
    windowMs: number
  ): Promise<{ success: boolean; limit: number; resetTime: number }> {
    const now = Date.now();

    if (this.store) {
      return this.redisConsume(identifier, limit, windowMs, now);
    }

    return this.memoryConsume(identifier, limit, windowMs, now);
  }

  private async redisConsume(
    identifier: string,
    limit: number,
    windowMs: number,
    now: number
  ): Promise<{ success: boolean; limit: number; resetTime: number }> {
    try {
      const redisKey = `rate_limit:${identifier}`;
      const current = await this.store!.get(redisKey);

      if (current === null || current === undefined) {
        await this.store!.set(redisKey, '1', { ex: Math.ceil(windowMs / 1000) });
        return { success: true, limit, resetTime: now + windowMs };
      }

      const count = parseInt(current as string, 10);
      if (count >= limit) {
        const ttl = await this.store!.expire?.(redisKey, Math.ceil(windowMs / 1000));
        if (ttl === undefined) {
          await this.store!.set(redisKey, String(count), { ex: Math.ceil(windowMs / 1000) });
        }
        return { success: false, limit, resetTime: now + windowMs };
      }

      await this.store!.incr(redisKey);
      return { success: true, limit, resetTime: now + windowMs };
    } catch (error) {
      logger.error('Redis rate limiting error, falling back to memory', error as Error, { identifier });
      return this.memoryConsume(identifier, limit, windowMs, now);
    }
  }

  private memoryConsume(
    identifier: string,
    limit: number,
    windowMs: number,
    now: number
  ): { success: boolean; limit: number; resetTime: number } {
    if (this.buckets.size >= MAX_MAP_SIZE) {
      this.evictStaleEntries();
    }

    const bucket = this.buckets.get(identifier);

    if (!bucket || now > bucket.resetTime) {
      this.buckets.set(identifier, { count: 1, resetTime: now + windowMs });
      return { success: true, limit, resetTime: now + windowMs };
    }

    if (bucket.count >= limit) {
      logger.warn('Rate limit exceeded', { identifier });
      return { success: false, limit, resetTime: bucket.resetTime };
    }

    bucket.count++;
    return { success: true, limit, resetTime: bucket.resetTime };
  }

  private evictStaleEntries(): void {
    const now = Date.now();
    for (const [key, bucket] of this.buckets) {
      if (now > bucket.resetTime) {
        this.buckets.delete(key);
      }
      if (this.buckets.size < MAX_MAP_SIZE / 2) break;
    }
  }

  async reset(identifier: string): Promise<void> {
    if (this.store) {
      try {
        await this.store.del(`rate_limit:${identifier}`);
      } catch (error) {
        logger.error('Error resetting rate limit in Redis', error as Error, { identifier });
      }
    }
    this.buckets.delete(identifier);
  }

  async getRemaining(
    identifier: string,
    limit: number,
    windowMs: number
  ): Promise<{ remaining: number; resetTime: number }> {
    const now = Date.now();

    if (this.store) {
      try {
        const redisKey = `rate_limit:${identifier}`;
        const current = await this.store.get(redisKey);
        if (current === null || current === undefined) {
          return { remaining: limit, resetTime: now + windowMs };
        }
        const count = parseInt(current as string, 10);
        return { remaining: Math.max(0, limit - count), resetTime: now + windowMs };
      } catch (error) {
        logger.error('Redis getRemaining error', error as Error);
      }
    }

    const bucket = this.buckets.get(identifier);
    if (bucket && now <= bucket.resetTime) {
      return { remaining: Math.max(0, limit - bucket.count), resetTime: bucket.resetTime };
    }
    return { remaining: limit, resetTime: now + windowMs };
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, bucket] of this.buckets) {
      if (now > bucket.resetTime) {
        this.buckets.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();
