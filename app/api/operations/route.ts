import { NextRequest, NextResponse } from 'next/server';
import { OperationsAssistantService } from '@/src/lib/ai/operations-assistant';
import { OperationsRequestSchema } from '@/src/lib/validation/schemas';
import { createApiHandler } from '@/src/lib/api/handler';
import {
  rateLimit,
  getRateLimitHeaders,
  getClientIdentifier,
  addSecurityHeaders,
} from '@/src/lib/security/middleware';
import { toErrorResult, RateLimitError } from '@/src/lib/errors';
import { logger } from '@/src/lib/logger';

const operationsService = new OperationsAssistantService();

export const POST = createApiHandler({
  name: 'Operations',
  inputSchema: OperationsRequestSchema,
  handler: async ({ input }) => {
    const recommendations = await operationsService.analyzeOperations(input || '');
    const dashboardData = operationsService.getDashboardData();
    return { recommendations, dashboardData };
  },
});

export async function GET(request: NextRequest) {
  logger.info('Operations dashboard GET request received');

  const clientId = getClientIdentifier(request);
  const rateLimitResult = await rateLimit(clientId);

  if (!rateLimitResult.allowed) {
    const response = NextResponse.json(
      toErrorResult(new RateLimitError()),
      { status: 429 }
    );
    const rateLimitHeaders = await getRateLimitHeaders(clientId);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return addSecurityHeaders(response);
  }

  const dashboardData = operationsService.getDashboardData();
  const response = NextResponse.json(dashboardData);
  return addSecurityHeaders(response);
}
