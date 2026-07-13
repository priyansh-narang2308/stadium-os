import { NextRequest, NextResponse } from "next/server";
import { OperationsAssistantService } from "@/src/lib/ai/operations-assistant";
import { OperationsRequestSchema } from "@/src/lib/validation/schemas";
import {
  rateLimit,
  getRateLimitHeaders,
  getClientIdentifier,
  addSecurityHeaders,
  sanitizeInput,
  validateContentType,
} from "@/src/lib/security/middleware";
import { toErrorResult, ValidationError } from "@/src/lib/errors";
import { logger } from "@/src/lib/logger";

export async function POST(request: NextRequest) {
  try {
    logger.info('Operations API request received');

    if (!validateContentType(request, ['application/json'])) {
      const error = new ValidationError('Invalid content type');
      const response = NextResponse.json(toErrorResult(error), { status: 415 });
      return addSecurityHeaders(response);
    }

    const clientId = getClientIdentifier(request);
    const rateLimitResult = await rateLimit(clientId);
    if (!rateLimitResult.allowed) {
      const response = NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
      // Add rate limit headers
      const rateLimitHeaders = await getRateLimitHeaders(clientId);
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return addSecurityHeaders(response);
    }

    const body = await request.json();
    const validationResult = OperationsRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const error = new ValidationError('Invalid request', validationResult.error.issues);
      const response = NextResponse.json(toErrorResult(error), { status: 400 });
      return addSecurityHeaders(response);
    }

    const { input } = validationResult.data;
    const sanitizedInput = sanitizeInput(input || '');

    const service = new OperationsAssistantService();
    const recommendations = await service.analyzeOperations(sanitizedInput);
    const dashboardData = service.getDashboardData();

    const response = NextResponse.json({ recommendations, dashboardData });
    logger.info('Operations API request completed successfully');
    return addSecurityHeaders(response);
  } catch (error) {
    logger.error('Operations API error', error as Error);
    const response = NextResponse.json(
      toErrorResult(error),
      { status: 500 },
    );
    return addSecurityHeaders(response);
  }
}

export async function GET(request: NextRequest) {
  try {
    logger.info('Operations dashboard data request received');

    const clientId = getClientIdentifier(request);
    const rateLimitResult = await rateLimit(clientId);
    if (!rateLimitResult.allowed) {
      const response = NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
      // Add rate limit headers
      const rateLimitHeaders = await getRateLimitHeaders(clientId);
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return addSecurityHeaders(response);
    }

    const service = new OperationsAssistantService();
    const dashboardData = service.getDashboardData();
    const response = NextResponse.json(dashboardData);
    logger.info('Operations dashboard data request completed successfully');
    return addSecurityHeaders(response);
  } catch (error) {
    logger.error('Operations GET API error', error as Error);
    const response = NextResponse.json(
      toErrorResult(error),
      { status: 500 },
    );
    return addSecurityHeaders(response);
  }
}
