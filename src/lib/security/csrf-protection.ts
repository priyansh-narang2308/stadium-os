/**
 * Enhanced CSRF Protection Utilities
 * Production-ready CSRF protection with multiple storage options
 */

import crypto from 'crypto';
import { logger } from '../logger';

const TOKEN_CACHE_TTL = 3600; // 1 hour

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SetOptions = Record<string, any>;

interface RedisCache {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: unknown, options?: SetOptions) => Promise<unknown>;
  del: (key: string) => Promise<number>;
}

class CSRFProtection {
  private cacheStore?: RedisCache;
  private staticTokens: Map<string, { token: string; timestamp: number }> = new Map();

  constructor() {
    const redisUrl = process.env.UPSTASH_REDIS_URL;
    const redisToken = process.env.UPSTASH_REDIS_TOKEN;
    
    if (redisUrl && redisToken) {
      void this.initializeRedisStore();
    }
  }

  private async initializeRedisStore(): Promise<void> {
    try {
      const { Redis } = await import('@upstash/redis');
      this.cacheStore = new Redis({ url: process.env.UPSTASH_REDIS_URL!, token: process.env.UPSTASH_REDIS_TOKEN! });
      logger.info('Redis-backed CSRF protection initialized');
    } catch {
      logger.warn('Failed to initialize Redis store, using in-memory fallback');
    }
  }

  async generateToken(userId?: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now();
    
    const tokenData = {
      token,
      timestamp,
      userId,
    };

    // Store token based on available storage
    if (this.cacheStore) {
      await this.cacheStore.set(
        `csrf:${token}`, 
        JSON.stringify(tokenData), 
        { ex: TOKEN_CACHE_TTL }
      );
    } else {
      this.staticTokens.set(token, tokenData);
    }
    
    return token;
  }

  async validateToken(token: string, userId?: string, maxAgeMs: number = 3600000): Promise<boolean> {
    try {
      let tokenData: { token: string; timestamp: number; userId?: string } | null = null;
      
      // Try to retrieve from Redis first
      if (this.cacheStore) {
        const stored = await this.cacheStore.get(`csrf:${token}`);
        if (stored) {
          tokenData = JSON.parse(stored as string);
        }
      }
      
      // Fall back to memory store
      if (!tokenData && this.staticTokens.has(token)) {
        tokenData = this.staticTokens.get(token)!;
      }
      
      if (!tokenData) {
        return false;
      }
      
      // Verify user-specific token if provided
      if (userId && tokenData.userId && tokenData.userId !== userId) {
        return false;
      }
      
      // Check token expiration
      const tokenAge = Date.now() - tokenData.timestamp;
      if (tokenAge >= maxAgeMs) {
        await this.cleanupExpiredToken(token);
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('CSRF token validation error', error as Error, { token: token.substring(0, 8) + '...' });
      return false;
    }
  }

  private async cleanupExpiredToken(token: string): Promise<void> {
    try {
      if (this.cacheStore) {
        await this.cacheStore.del(`csrf:${token}`);
      } else {
        this.staticTokens.delete(token);
      }
    } catch (error) {
      logger.error('Error cleaning up expired token', error as Error, { token: token.substring(0, 8) + '...' });
    }
  }

  async rotateToken(oldToken: string, userId?: string): Promise<string> {
    await this.cleanupExpiredToken(oldToken);
    return this.generateToken(userId);
  }

  async getTokenMetadata(token: string): Promise<unknown> {
    try {
      if (this.cacheStore) {
        const stored = await this.cacheStore.get(`csrf:${token}`);
        return stored ? JSON.parse(stored as string) : null;
      } else {
        return this.staticTokens.get(token) || null;
      }
    } catch (error) {
      logger.error('Error retrieving token metadata', error as Error, { token: token.substring(0, 8) + '...' });
      return null;
    }
  }
}

export const csrfProtection = new CSRFProtection();