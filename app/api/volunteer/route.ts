import { NextRequest, NextResponse } from "next/server";
import { VolunteerAssistantService } from "@/src/lib/ai/volunteer-assistant";
import { 
  VolunteerRequestSchema,
  VolunteerAssistantResponseSchema 
} from "@/src/lib/validation/schemas";
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
    logger.info('Volunteer assistant API request received');

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
    const validationResult = VolunteerRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const error = new ValidationError('Invalid request', validationResult.error.issues);
      const response = NextResponse.json(toErrorResult(error), { status: 400 });
      return addSecurityHeaders(response);
    }

    const { query } = validationResult.data;
    const sanitizedQuery = sanitizeInput(query);

    const service = new VolunteerAssistantService();
    const response = await service.getGuidance(sanitizedQuery);

    const validatedResponse = VolunteerAssistantResponseSchema.parse(response);
    const apiResponse = NextResponse.json(validatedResponse);
    logger.info('Volunteer assistant API request completed successfully');
    return addSecurityHeaders(apiResponse);
  } catch (error) {
    logger.error('Volunteer Assistant API error', error as Error);
    const response = NextResponse.json(
      toErrorResult(error),
      { status: 500 },
    );
    return addSecurityHeaders(response);
  }
}
