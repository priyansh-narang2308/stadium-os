import { describe, it, expect } from 'vitest';
import { generateCSRFToken, validateCSRFToken } from './csrf';

describe('CSRF Protection', () => {
  describe('generateCSRFToken', () => {
    it('should generate a token with payload and signature', () => {
      const token = generateCSRFToken();
      const parts = token.split('.');

      expect(parts).toHaveLength(2);
      expect(parts[0]).toBeTruthy();
      expect(parts[1]).toMatch(/^[a-f0-9]{64}$/);
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
      expect(validateCSRFToken(token, 0)).toBe(false);
    });

    it('should reject malformed tokens', () => {
      expect(validateCSRFToken('invalid')).toBe(false);
      expect(validateCSRFToken('no-signature')).toBe(false);
    });

    it('should reject tokens with tampered payload', () => {
      const token = generateCSRFToken();
      const parts = token.split('.');
      const tampered = `tampered.${parts[1]}`;
      expect(validateCSRFToken(tampered)).toBe(false);
    });

    it('should reject tokens with tampered signature', () => {
      const token = generateCSRFToken();
      const parts = token.split('.');
      const tampered = `${parts[0]}.tampered`;
      expect(validateCSRFToken(tampered)).toBe(false);
    });
  });
});
