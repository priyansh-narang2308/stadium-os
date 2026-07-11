import { describe, it, expect } from 'vitest';
import { generateCSRFToken, validateCSRFToken } from './csrf';

describe('CSRF Protection', () => {
  describe('generateCSRFToken', () => {
    it('should generate a token with timestamp', () => {
      const token = generateCSRFToken();
      const parts = token.split(':');
      
      expect(parts).toHaveLength(2);
      expect(parts[0]).toHaveLength(64); // 32 bytes = 64 hex chars
      expect(parts[1]).toMatch(/^\d+$/); // timestamp
    });

    it('should generate unique tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('validateCSRFToken', () => {
    it('should validate a valid token', () => {
      const token = generateCSRFToken();
      expect(validateCSRFToken(token)).toBe(true);
    });

    it('should reject expired tokens', () => {
      const token = generateCSRFToken();
      expect(validateCSRFToken(token, 0)).toBe(false); // 0ms max age
    });

    it('should reject malformed tokens', () => {
      expect(validateCSRFToken('invalid')).toBe(false);
      expect(validateCSRFToken('invalid:timestamp')).toBe(false);
    });

    it('should reject tokens with invalid hash length', () => {
      expect(validateCSRFToken('short:1234567890')).toBe(false);
    });
  });
});
