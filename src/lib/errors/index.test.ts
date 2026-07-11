import { describe, it, expect } from 'vitest';
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
  ExternalServiceError,
  DatabaseError,
  toErrorResult,
} from './index';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create error with message and code', () => {
      const error = new AppError('Test error', 'TEST_ERROR');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.statusCode).toBe(500);
    });

    it('should create error with custom status code', () => {
      const error = new AppError('Test error', 'TEST_ERROR', 400);
      expect(error.statusCode).toBe(400);
    });

    it('should create error with details', () => {
      const details = { field: 'test' };
      const error = new AppError('Test error', 'TEST_ERROR', 500, details);
      expect(error.details).toEqual(details);
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with 400 status', () => {
      const error = new ValidationError('Invalid input');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
    });

    it('should accept details', () => {
      const details = { field: 'email', message: 'Invalid email format' };
      const error = new ValidationError('Invalid input', details);
      expect(error.details).toEqual(details);
    });
  });

  describe('AuthenticationError', () => {
    it('should create authentication error with 401 status', () => {
      const error = new AuthenticationError();
      expect(error.code).toBe('AUTHENTICATION_ERROR');
      expect(error.statusCode).toBe(401);
    });

    it('should accept custom message', () => {
      const error = new AuthenticationError('Custom auth error');
      expect(error.message).toBe('Custom auth error');
    });
  });

  describe('AuthorizationError', () => {
    it('should create authorization error with 403 status', () => {
      const error = new AuthorizationError();
      expect(error.code).toBe('AUTHORIZATION_ERROR');
      expect(error.statusCode).toBe(403);
    });
  });

  describe('NotFoundError', () => {
    it('should create not found error with 404 status', () => {
      const error = new NotFoundError('User');
      expect(error.code).toBe('NOT_FOUND');
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('User not found');
    });
  });

  describe('RateLimitError', () => {
    it('should create rate limit error with 429 status', () => {
      const error = new RateLimitError();
      expect(error.code).toBe('RATE_LIMIT_ERROR');
      expect(error.statusCode).toBe(429);
    });
  });

  describe('ExternalServiceError', () => {
    it('should create external service error with 502 status', () => {
      const error = new ExternalServiceError('Google GenAI', 'Service unavailable');
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR');
      expect(error.statusCode).toBe(502);
      expect(error.message).toBe('Google GenAI: Service unavailable');
    });
  });

  describe('DatabaseError', () => {
    it('should create database error with 500 status', () => {
      const error = new DatabaseError();
      expect(error.code).toBe('DATABASE_ERROR');
      expect(error.statusCode).toBe(500);
    });
  });
});

describe('toErrorResult', () => {
  it('should convert AppError to error result', () => {
    const error = new ValidationError('Invalid input', { field: 'test' });
    const result = toErrorResult(error);
    expect(result).toEqual({
      error: 'Invalid input',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      details: { field: 'test' },
    });
  });

  it('should convert generic Error to error result', () => {
    const error = new Error('Something went wrong');
    const result = toErrorResult(error);
    expect(result).toEqual({
      error: 'Something went wrong',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    });
  });

  it('should convert unknown error to error result', () => {
    const result = toErrorResult('unknown error');
    expect(result).toEqual({
      error: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
    });
  });
});
