import { NextResponse } from "next/server";
import { VolunteerAssistantService } from "@/src/lib/ai/volunteer-assistant";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, user } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const service = new VolunteerAssistantService();
    const response = await service.getGuidance(
      query,
      user || {
        id: "volunteer-001",
        role: "volunteer",
        language: "en",
      },
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Volunteer Assistant API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
