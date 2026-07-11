import { NextRequest, NextResponse } from 'next/server';
import { EnvSchema } from '../validation/schemas';
import { logger } from '../logger';
import { 
  RATE_LIMIT_WINDOW_MS, 
  RATE_LIMIT_MAX_REQUESTS,
  MAX_INPUT_LENGTH 
} from '../constants';
import { generateCSRFToken, validateCSRFToken, getCSRFTokenFromHeaders } from './csrf';

// Rate limiting (in-memory for demo, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function validateEnv() {
  try {
    EnvSchema.parse({
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      NODE_ENV: process.env.NODE_ENV || 'development',
    });
    logger.info('Environment validation successful');
  } catch (error) {
    logger.error('Environment validation failed', error as Error);
    throw new Error('Invalid environment configuration');
  }
}

export function rateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    logger.warn('Rate limit exceeded', { identifier });
    return false;
  }

  record.count++;
  return true;
}

export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
  );

  // Other security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, MAX_INPUT_LENGTH); // Limit length
}

export function validateContentType(request: NextRequest, allowedTypes: string[]): boolean {
  const contentType = request.headers.get('content-type');
  if (!contentType) return false;
  return allowedTypes.some((type) => contentType.includes(type));
}

export function addCSRFProtection(response: NextResponse): NextResponse {
  const token = generateCSRFToken();
  response.headers.set('x-csrf-token', token);
  response.cookies.set('csrf-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600,
  });
  return response;
}

export function validateCSRFRequest(request: NextRequest): boolean {
  const headerToken = getCSRFTokenFromHeaders(request.headers);
  const cookieToken = request.cookies.get('csrf-token')?.value;
  
  if (!headerToken || !cookieToken) {
    logger.warn('CSRF tokens missing');
    return false;
  }
  
  if (headerToken !== cookieToken) {
    logger.warn('CSRF token mismatch');
    return false;
  }
  
  return validateCSRFToken(headerToken);
}
