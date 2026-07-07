import { NextResponse } from "next/server";
import { FanAssistantService } from "@/src/lib/ai/fan-assistant";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, user } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const service = new FanAssistantService();
    const response = await service.processQuery(
      query,
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

    return NextResponse.json(response);
  } catch (error) {
    console.error("Fan Assistant API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
