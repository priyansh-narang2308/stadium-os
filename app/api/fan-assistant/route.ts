import { NextRequest, NextResponse } from "next/server";
import { FanAssistantService } from "@/src/lib/ai/fan-assistant";
import { 
  FanAssistantRequestSchema,
  FanAssistantResponseSchema 
} from "@/src/lib/validation/schemas";
import {
  rateLimit,
  getClientIdentifier,
  addSecurityHeaders,
  sanitizeInput,
  validateContentType,
} from "@/src/lib/security/middleware";
import { toErrorResult, ValidationError } from "@/src/lib/errors";
import { logger } from "@/src/lib/logger";

export async function POST(request: NextRequest) {
  try {
    logger.info('Fan assistant API request received');

    // Validate content type
    if (!validateContentType(request, ['application/json'])) {
      const error = new ValidationError('Invalid content type');
      const response = NextResponse.json(toErrorResult(error), { status: 415 });
      return addSecurityHeaders(response);
    }

    // Rate limiting
    const clientId = getClientIdentifier(request);
    if (!rateLimit(clientId)) {
      const response = NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
      return addSecurityHeaders(response);
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = FanAssistantRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const error = new ValidationError('Invalid request', validationResult.error.issues);
      const response = NextResponse.json(toErrorResult(error), { status: 400 });
      return addSecurityHeaders(response);
    }

    const { query, user } = validationResult.data;
    const sanitizedQuery = sanitizeInput(query);

    const service = new FanAssistantService();
    const response = await service.processQuery(
      sanitizedQuery,
      user || {
        id: "anonymous",
        role: "fan",
        language: "en",
        accessibilityPreferences: {
          wheelchair: false,
          visualImpairment: false,
          hearingImpairment: false,
        },
      },
    );

    // Validate response
    const validatedResponse = FanAssistantResponseSchema.parse(response);
    const apiResponse = NextResponse.json(validatedResponse);
    logger.info('Fan assistant API request completed successfully');
    return addSecurityHeaders(apiResponse);
  } catch (error) {
    logger.error('Fan Assistant API error', error as Error);
    const response = NextResponse.json(
      toErrorResult(error),
      { status: 500 },
    );
    return addSecurityHeaders(response);
  }
}
