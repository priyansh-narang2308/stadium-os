import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createApiHandler } from './handler';

const TestSchema = z.object({
  message: z.string().min(1),
});

describe('createApiHandler', () => {
  beforeEach(() => {
    vi.stubGlobal('process', {
      ...process,
      env: { ...process.env },
    });
  });

  it('should reject non-JSON content type', async () => {
    const handler = createApiHandler({
      name: 'Test',
      handler: async (input: unknown) => input,
    });

    const request = new NextRequest('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: JSON.stringify({}),
    });

    const response = await handler(request);
    expect(response.status).toBe(415);
  });

  it('should validate input against schema', async () => {
    const handler = createApiHandler({
      name: 'Test',
      inputSchema: TestSchema,
      handler: async (input) => input,
    });

    const request = new NextRequest('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await handler(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.code).toBe('VALIDATION_ERROR');
  });

  it('should return 200 for valid input', async () => {
    const handler = createApiHandler({
      name: 'Test',
      inputSchema: TestSchema,
      handler: async (input) => input,
    });

    const request = new NextRequest('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'hello' }),
    });

    const response = await handler(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('hello');
  });

  it('should validate output against schema', async () => {
    const OutputSchema = z.object({
      result: z.string(),
    });

    const handler = createApiHandler({
      name: 'Test',
      handler: async () => ({ result: 'success' }),
      outputSchema: OutputSchema,
    });

    const request = new NextRequest('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await handler(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.result).toBe('success');
  });

  it('should reject oversized request bodies', async () => {
    const handler = createApiHandler({
      name: 'Test',
      maxBodySize: 10,
      handler: async (input: unknown) => input,
    });

    const request = new NextRequest('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'this is a very long message that exceeds the limit' }),
    });

    const response = await handler(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.code).toBe('VALIDATION_ERROR');
  });

  it('should add security headers to response', async () => {
    const handler = createApiHandler({
      name: 'Test',
      handler: async (input: unknown) => input,
    });

    const request = new NextRequest('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await handler(request);
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('Strict-Transport-Security')).toBeTruthy();
    expect(response.headers.get('Content-Security-Policy')).toBeTruthy();
  });

  it('should handle handler errors gracefully', async () => {
    const handler = createApiHandler({
      name: 'Test',
      handler: async () => {
        throw new Error('Unexpected error');
      },
    });

    const request = new NextRequest('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await handler(request);
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.code).toBe('INTERNAL_ERROR');
  });
});
