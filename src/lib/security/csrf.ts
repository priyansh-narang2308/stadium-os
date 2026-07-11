/**
 * CSRF Protection Utilities
 * Provides CSRF token generation and validation
 */

import { randomBytes } from 'crypto';

export function generateCSRFToken(): string {
  const token = randomBytes(32).toString('hex');
  const timestamp = Date.now().toString();
  return `${token}:${timestamp}`;
}

export function validateCSRFToken(token: string, maxAgeMs: number = 3600000): boolean {
  try {
    const [hash, timestamp] = token.split(':');
    const tokenAge = Date.now() - parseInt(timestamp, 10);
    
    if (tokenAge > maxAgeMs) {
      return false;
    }
    
    return hash.length === 64; // SHA-256 produces 64 hex characters
  } catch {
    return false;
  }
}

export function getCSRFTokenFromHeaders(headers: Headers): string | null {
  return headers.get('x-csrf-token') || null;
}
