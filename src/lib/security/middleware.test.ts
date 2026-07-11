import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  sanitizeInput,
  getClientIdentifier,
} from './middleware';
import { NextRequest } from 'next/server';

describe('Security Middleware', () => {
  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>hello')).toBe(
        'alert("xss")hello'
      );
    });

    it('should limit length to 1000 characters', () => {
      const longInput = 'a'.repeat(1001);
      expect(sanitizeInput(longInput).length).toBe(1000);
    });

    it('should handle empty input', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('should handle special characters', () => {
      expect(sanitizeInput('hello<>world')).toBe('helloworld');
    });
  });

  describe('getClientIdentifier', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const request = {
        headers: {
          get: vi.fn((header: string) => {
            if (header === 'x-forwarded-for') return '192.168.1.1, 10.0.0.1';
            if (header === 'x-real-ip') return null;
            return null;
          }),
        },
      } as unknown as NextRequest;

      const ip = getClientIdentifier(request);
      expect(ip).toBe('192.168.1.1');
    });

    it('should extract IP from x-real-ip header as fallback', () => {
      const request = {
        headers: {
          get: vi.fn((header: string) => {
            if (header === 'x-forwarded-for') return null;
            if (header === 'x-real-ip') return '192.168.1.2';
            return null;
          }),
        },
      } as unknown as NextRequest;

      const ip = getClientIdentifier(request);
      expect(ip).toBe('192.168.1.2');
    });

    it('should return unknown if no IP headers present', () => {
      const request = {
        headers: {
          get: vi.fn(() => null),
        },
      } as unknown as NextRequest;

      const ip = getClientIdentifier(request);
      expect(ip).toBe('unknown');
    });
  });
});
