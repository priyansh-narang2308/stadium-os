import { NextRequest, NextResponse } from "next/server";
import { OperationsAssistantService } from "@/src/lib/ai/operations-assistant";
import { OperationsRequestSchema } from "@/src/lib/validation/schemas";
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
    const validationResult = OperationsRequestSchema.safeParse(body);
    if (!validationResult.success) {
      const response = NextResponse.json(
        { error: 'Invalid request', details: validationResult.error.issues },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const { input } = validationResult.data;
    const sanitizedInput = sanitizeInput(input || '');

    const service = new OperationsAssistantService();
    const recommendations = await service.analyzeOperations(sanitizedInput);
    const dashboardData = service.getDashboardData();

    const response = NextResponse.json({ recommendations, dashboardData });
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Operations API error:", error);
    const response = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
    return addSecurityHeaders(response);
  }
}

export async function GET(request: NextRequest) {
  try {
    const clientId = getClientIdentifier(request);
    if (!rateLimit(clientId)) {
      const response = NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
      return addSecurityHeaders(response);
    }

    const service = new OperationsAssistantService();
    const dashboardData = service.getDashboardData();
    const response = NextResponse.json(dashboardData);
    return addSecurityHeaders(response);
  } catch (error) {
    console.error("Operations API error:", error);
    const response = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
    return addSecurityHeaders(response);
  }
}
