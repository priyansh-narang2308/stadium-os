import { NextRequest, NextResponse } from "next/server";
import { VolunteerAssistantService } from "@/src/lib/ai/volunteer-assistant";
import { 
  VolunteerRequestSchema,
  VolunteerAssistantResponseSchema 
} from "@/src/lib/validation/schemas";
import {
  rateLimit,
  getClientIdentifier,
  addSecurityHeaders,
  sanitizeInput,
  validateContentType,
} from "@/src/lib/security/middleware";

export async function POST(request: NextRequest) {
  try {
    if (!validateContentType(request, ['application/json'])) {
      const response = NextResponse.json(
        { error: 'Invalid content type' },
        { status: 415 }
      );
      return addSecurityHeaders(response);
    }

    const clientId = getClientIdentifier(request);
    if (!rateLimit(clientId)) {
      const response = NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
      return addSecurityHeaders(response);
    }

    const body = await request.json();
    const validationResult = VolunteerRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const response = NextResponse.json(
        { error: 'Invalid request', details: validationResult.error.issues },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const { query } = validationResult.data;
    const sanitizedQuery = sanitizeInput(query);

    const service = new VolunteerAssistantService();
    const response = await service.getGuidance(sanitizedQuery);

    const validatedResponse = VolunteerAssistantResponseSchema.parse(response);
    const apiResponse = NextResponse.json(validatedResponse);
    return addSecurityHeaders(apiResponse);
  } catch (error) {
    console.error("Volunteer Assistant API error:", error);
    const response = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
    return addSecurityHeaders(response);
  }
}
