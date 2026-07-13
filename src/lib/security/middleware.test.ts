import { describe, it, expect, vi } from 'vitest';
import {
  sanitizeInput,
  getClientIdentifier,
  addSecurityHeaders,
  validateContentType,
} from './middleware';
import { NextRequest, NextResponse } from 'next/server';

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

  describe('addSecurityHeaders', () => {
    it('should add CSP header', () => {
      const response = new NextResponse();
      const result = addSecurityHeaders(response);
      expect(result.headers.get('Content-Security-Policy')).toBeTruthy();
      expect(result.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
    });

    it('should add XSS protection header', () => {
      const response = new NextResponse();
      const result = addSecurityHeaders(response);
      expect(result.headers.get('X-XSS-Protection')).toBe('1; mode=block');
    });

    it('should add HSTS header', () => {
      const response = new NextResponse();
      const result = addSecurityHeaders(response);
      expect(result.headers.get('Strict-Transport-Security')).toContain('max-age=31536000');
    });

    it('should add frame protection', () => {
      const response = new NextResponse();
      const result = addSecurityHeaders(response);
      expect(result.headers.get('X-Frame-Options')).toBe('DENY');
    });

    it('should add cross-origin isolation headers', () => {
      const response = new NextResponse();
      const result = addSecurityHeaders(response);
      expect(result.headers.get('Cross-Origin-Embedder-Policy')).toBe('require-corp');
      expect(result.headers.get('Cross-Origin-Opener-Policy')).toBe('same-origin');
    });
  });

  describe('validateContentType', () => {
    it('should accept matching content type', () => {
      const request = {
        headers: {
          get: vi.fn(() => 'application/json'),
        },
      } as unknown as NextRequest;

      expect(validateContentType(request, ['application/json'])).toBe(true);
    });

    it('should reject non-matching content type', () => {
      const request = {
        headers: {
          get: vi.fn(() => 'text/plain'),
        },
      } as unknown as NextRequest;

      expect(validateContentType(request, ['application/json'])).toBe(false);
    });

    it('should reject missing content type', () => {
      const request = {
        headers: {
          get: vi.fn(() => null),
        },
      } as unknown as NextRequest;

      expect(validateContentType(request, ['application/json'])).toBe(false);
    });
  });
});
