/**
 * Request Validation Utilities
 * Comprehensive request validation for security
 */

import { NextRequest } from 'next/server';
import { ValidationError } from '../errors';
import { logger } from '../logger';

export function validateQueryParams(request: NextRequest, allowedParams: string[]): void {
  const searchParams = request.nextUrl.searchParams;
  const providedParams = Array.from(searchParams.keys());
  
  const invalidParams = providedParams.filter(param => !allowedParams.includes(param));
  
  if (invalidParams.length > 0) {
    logger.warn('Invalid query parameters provided', { invalidParams });
    throw new ValidationError(`Invalid query parameters: ${invalidParams.join(', ')}`);
  }
}

export function validatePathParams(request: NextRequest, expectedPattern: RegExp): void {
  const pathname = request.nextUrl.pathname;
  
  if (!expectedPattern.test(pathname)) {
    logger.warn('Invalid path pattern', { pathname });
    throw new ValidationError('Invalid path parameters');
  }
}

export function sanitizeQueryParams(searchParams: URLSearchParams): Record<string, string> {
  const sanitized: Record<string, string> = {};
  
  searchParams.forEach((value, key) => {
    // Remove any HTML tags and limit length
    const sanitizedValue = value
      .trim()
      .replace(/[<>]/g, '')
      .substring(0, 100);
    
    sanitized[key] = sanitizedValue;
  });
  
  return sanitized;
}
