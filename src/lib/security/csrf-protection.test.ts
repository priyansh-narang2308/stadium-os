import { describe, it, expect } from 'vitest';
import { csrfProtection } from './csrf-protection';

describe('csrfProtection', () => {
  describe('generateToken', () => {
    it('should generate a token string', async () => {
      const token = await csrfProtection.generateToken();
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(32);
    });

    it('should generate unique tokens', async () => {
      const [token1, token2] = await Promise.all([
        csrfProtection.generateToken(),
        csrfProtection.generateToken(),
      ]);
      expect(token1).not.toBe(token2);
    });

    it('should accept an optional userId', async () => {
      const token = await csrfProtection.generateToken('user-123');
      expect(token).toBeTruthy();
    });
  });

  describe('validateToken', () => {
    it('should validate a recently generated token', async () => {
      const token = await csrfProtection.generateToken();
      const isValid = await csrfProtection.validateToken(token);
      expect(isValid).toBe(true);
    });

    it('should reject an invalid token', async () => {
      const isValid = await csrfProtection.validateToken('invalid-token');
      expect(isValid).toBe(false);
    });

    it('should reject an expired token', async () => {
      const token = await csrfProtection.generateToken();
      const isValid = await csrfProtection.validateToken(token, undefined, 0);
      expect(isValid).toBe(false);
    });

    it('should validate a token for a specific userId', async () => {
      const token = await csrfProtection.generateToken('user-123');
      const isValid = await csrfProtection.validateToken(token, 'user-123');
      expect(isValid).toBe(true);
    });
  });

  describe('rotateToken', () => {
    it('should generate a new token and invalidate the old one', async () => {
      const oldToken = await csrfProtection.generateToken();
      const newToken = await csrfProtection.rotateToken(oldToken);

      expect(oldToken).not.toBe(newToken);

      const oldTokenValid = await csrfProtection.validateToken(oldToken);
      expect(oldTokenValid).toBe(false);
    });
  });

  describe('getTokenMetadata', () => {
    it('should return metadata for a valid token', async () => {
      const token = await csrfProtection.generateToken('user-456');
      const metadata = await csrfProtection.getTokenMetadata(token);
      expect(metadata).not.toBeNull();
      expect(metadata).toHaveProperty('token', token);
    });

    it('should return null for an invalid token', async () => {
      const metadata = await csrfProtection.getTokenMetadata('nonexistent-token');
      expect(metadata).toBeNull();
    });
  });
});
