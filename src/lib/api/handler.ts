import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '../logger';
import {
  rateLimit,
  getRateLimitHeaders,
  getClientIdentifier,
  addSecurityHeaders,
  sanitizeInput,
  validateContentType,
} from '../security/middleware';
import { toErrorResult, ValidationError, RateLimitError } from '../errors';

type RequestHandler<TInput, TOutput> = (
  input: TInput,
  request: NextRequest
) => Promise<TOutput>;

interface ApiHandlerConfig<TInput = unknown, TOutput = unknown> {
  name: string;
  inputSchema?: z.ZodType<TInput>;
  outputSchema?: z.ZodType<TOutput>;
  handler: RequestHandler<TInput, TOutput>;
  maxBodySize?: number;
}

const MAX_BODY_SIZE = 10_000;

function deepSanitize(value: unknown): unknown {
  if (typeof value === 'string') {
    return sanitizeInput(value);
  }
  if (Array.isArray(value)) {
    return value.map(deepSanitize);
  }
  if (value !== null && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>)) {
      sanitized[key] = deepSanitize((value as Record<string, unknown>)[key]);
    }
    return sanitized;
  }
  return value;
}

async function parseBody(request: NextRequest, maxSize: number): Promise<unknown> {
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > maxSize) {
    throw new ValidationError('Request body too large');
  }

  const text = await request.text();
  if (text.length > maxSize) {
    throw new ValidationError('Request body too large');
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new ValidationError('Request body contains invalid JSON');
  }
}

export function createApiHandler<TInput, TOutput>(
  config: ApiHandlerConfig<TInput, TOutput>
) {
  const { name, inputSchema, outputSchema, handler, maxBodySize = MAX_BODY_SIZE } = config;

  return async function routeHandler(request: NextRequest): Promise<NextResponse> {
    try {
      logger.info(`${name} API request received`, {
        method: request.method,
        url: request.url,
      });

      if (!validateContentType(request, ['application/json'])) {
        const error = new ValidationError('Invalid content type');
        const response = NextResponse.json(toErrorResult(error), { status: 415 });
        return addSecurityHeaders(response);
      }

      const clientId = getClientIdentifier(request);
      const rateLimitResult = await rateLimit(clientId);
      if (!rateLimitResult.allowed) {
        const error = new RateLimitError();
        const response = NextResponse.json(toErrorResult(error), { status: 429 });
        const rateLimitHeaders = await getRateLimitHeaders(clientId);
        Object.entries(rateLimitHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        return addSecurityHeaders(response);
      }

      const body = await parseBody(request, maxBodySize);

      let validatedInput: TInput;
      if (inputSchema) {
        const result = inputSchema.safeParse(body);
        if (!result.success) {
          const error = new ValidationError(
            'Invalid request parameters',
            result.error.issues.map((issue) => ({
              path: issue.path.join('.'),
              message: issue.message,
            }))
          );
          const response = NextResponse.json(toErrorResult(error), { status: 400 });
          return addSecurityHeaders(response);
        }
        validatedInput = deepSanitize(result.data) as TInput;
      } else {
        validatedInput = deepSanitize(body) as TInput;
      }

      const output = await handler(validatedInput, request);

      let responseBody: TOutput;
      if (outputSchema) {
        try {
          responseBody = outputSchema.parse(output);
        } catch (error) {
          logger.error(`${name} response validation failed`, error instanceof Error ? error : new Error(String(error)));
          const response = NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
          return addSecurityHeaders(response);
        }
      } else {
        responseBody = output;
      }

      const apiResponse = NextResponse.json(responseBody);
      logger.info(`${name} API request completed successfully`);
      return addSecurityHeaders(apiResponse);
    } catch (error) {
      if (error instanceof ValidationError || error instanceof RateLimitError) {
        const response = NextResponse.json(
          toErrorResult(error),
          { status: error instanceof ValidationError ? 400 : 429 }
        );
        return addSecurityHeaders(response);
      }

      logger.error(`${name} API error`, error instanceof Error ? error : new Error(String(error)));
      const response = NextResponse.json(
        toErrorResult(error),
        { status: 500 }
      );
      return addSecurityHeaders(response);
    }
  };
}
