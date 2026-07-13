/**
 * Production Rate Limiting
 * Redis-based rate limiting for scalability
 */

import { logger } from '../logger';

interface RedisStore {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: unknown, options?: { ex?: number }) => Promise<void>;
  incr: (key: string) => Promise<number>;
  del: (key: string) => Promise<number>;
}

export class RateLimiter {
  private store?: RedisStore;
  private slidingWindowBuckets: Map<string, { count: number; resetTime: number }> = new Map();

  constructor() {
    this.initializeStore();
  }

  private async initializeStore(): Promise<void> {
    try {
      const redisUrl = process.env.UPSTASH_REDIS_URL;
      const redisToken = process.env.UPSTASH_REDIS_TOKEN;
      
      if (redisUrl && redisToken) {
        const { Redis } = await import('@upstash/redis');
        this.store = new Redis({ url: redisUrl, token: redisToken });
        logger.info('Redis-backed rate limiter initialized');
      } else {
        logger.warn('Redis not configured, using sliding window in-memory implementation');
      }
    } catch (error) {
      logger.error('Failed to initialize store', error as Error);
    }
  }

  async consume(identifier: string, limit: number, windowMs: number): Promise<{ success: boolean; limit: number; resetTime: number }> {
    const now = Date.now();
    
    // Try Redis store first if available
    if (this.store) {
      try {
        const redisKey = `rate_limit:${identifier}`;
        const current = await this.store.get(redisKey);
        
        if (!current) {
          // No existing record, set initial value
          await this.store.set(redisKey, '1', { ex: Math.ceil(windowMs / 1000) });
          return {
            success: true,
            limit,
            resetTime: now + windowMs,
          };
        }
        
        if (parseInt(current as string) >= limit) {
          return {
            success: false,
            limit,
            resetTime: now + windowMs,
          };
        }
        
        // Increment count using Redis INCR
        await this.store.incr(redisKey);
        
        return {
          success: true,
          limit,
          resetTime: now + windowMs,
        };
      } catch (error) {
        logger.error('Redis rate limiting error', error as Error, { identifier });
        // Fallback to sliding window
      }
    }
    
    // Fallback to sliding window implementation
    return this.slidingWindowConsume(identifier, limit, windowMs);
  }

  private slidingWindowConsume(identifier: string, limit: number, windowMs: number): {
    success: boolean;
    limit: number;
    resetTime: number;
  } {
    const now = Date.now();
    const bucket = this.slidingWindowBuckets.get(identifier);
    
    // Clean up old buckets
    if (bucket && now > bucket.resetTime) {
      this.slidingWindowBuckets.delete(identifier);
    }
    
    // Create new bucket if needed
    if (!bucket) {
      this.slidingWindowBuckets.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return {
        success: true,
        limit,
        resetTime: now + windowMs,
      };
    }
    
    // Check if bucket has capacity
    if (bucket.count >= limit) {
      logger.warn('Rate limit exceeded', { identifier });
      return {
        success: false,
        limit,
        resetTime: bucket.resetTime,
      };
    }
    
    // Increment bucket count
    bucket.count++;
    return {
      success: true,
      limit,
      resetTime: bucket.resetTime,
    };
  }

  async reset(identifier: string): Promise<void> {
    if (this.store) {
      try {
        await this.store.del(`rate_limit:${identifier}`);
      } catch (error) {
        logger.error('Error resetting rate limit in Redis', error as Error, { identifier });
      }
    }
    this.slidingWindowBuckets.delete(identifier);
  }

  async getRemaining(identifier: string, limit: number, windowMs: number): Promise<{ remaining: number; resetTime: number }> {
    const now = Date.now();
    const bucket = this.slidingWindowBuckets.get(identifier);
    
    if (bucket && now <= bucket.resetTime) {
      const remaining = Math.max(0, limit - bucket.count);
      return {
        remaining,
        resetTime: bucket.resetTime,
      };
    }
    
    return {
      remaining: limit,
      resetTime: now + windowMs,
    };
  }
}

export const rateLimiter = new RateLimiter();