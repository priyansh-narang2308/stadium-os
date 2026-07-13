/**
 * Redis-based Cache Service
 * Production-ready caching implementation with lazy initialization
 */

import { logger } from '../logger';

interface CacheStore {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown, options?: { ex?: number }): Promise<void>;
  setex(key: string, seconds: number, value: string): Promise<void>;
  del(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  flushall(): Promise<void>;
}

export class CacheService {
  private store?: CacheStore;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    const redisUrl = process.env.UPSTASH_REDIS_URL;
    const redisToken = process.env.UPSTASH_REDIS_TOKEN;
    
    if (!redisUrl || !redisToken) {
      logger.warn('Redis not configured, caching disabled');
      return;
    }

    try {
      const { Redis } = await import('@upstash/redis');
      this.store = new Redis({ url: redisUrl, token: redisToken });
      logger.info('Redis cache initialized');
    } catch (error) {
      logger.warn('Failed to initialize Redis, caching disabled', { error: error instanceof Error ? error.message : String(error) });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.store) return null;
    try {
      const value = await this.store.get(key);
      return value ? JSON.parse(value as string) : null;
    } catch (error) {
      logger.error('Cache get error', error as Error, { key });
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (!this.store) return;
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.store.setex(key, ttlSeconds, serialized);
      } else {
        await this.store.set(key, serialized);
      }
    } catch (error) {
      logger.error('Cache set error', error as Error, { key });
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.store) return;
    try {
      await this.store.del(key);
    } catch (error) {
      logger.error('Cache delete error', error as Error, { key });
    }
  }

  async keys(pattern: string): Promise<string[]> {
    if (!this.store) return [];
    try {
      return await this.store.keys(pattern);
    } catch (error) {
      logger.error('Cache keys error', error as Error, { pattern });
      return [];
    }
  }

  async flush(): Promise<void> {
    if (!this.store) return;
    try {
      await this.store.flushall();
    } catch (error) {
      logger.error('Cache flush error', error as Error);
    }
  }
}

export const cacheService = new CacheService();
