/**
 * Redis-based Cache Service
 * Production-ready caching implementation
 */

import { Redis } from '@upstash/redis';
import { logger } from './logger';

export class CacheService {
  private redis: Redis;

  constructor() {
    const redisUrl = process.env.UPSTASH_REDIS_URL;
    const redisToken = process.env.UPSTASH_REDIS_TOKEN;
    
    if (!redisUrl || !redisToken) {
      throw new Error('Redis configuration missing. Set UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN');
    }
    
    this.redis = new Redis({ url: redisUrl, token: redisToken });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value as string) : null;
    } catch (error) {
      logger.error('Cache get error', error as Error, { key });
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, serialized);
      } else {
        await this.redis.set(key, serialized);
      }
    } catch (error) {
      logger.error('Cache set error', error as Error, { key });
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error('Cache delete error', error as Error, { key });
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      logger.error('Cache keys error', error as Error, { pattern });
      return [];
    }
  }

  async flush(): Promise<void> {
    try {
      await this.redis.flushall();
    } catch (error) {
      logger.error('Cache flush error', error as Error);
    }
  }
}
