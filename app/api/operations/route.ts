import { NextResponse } from "next/server";
import { OperationsAssistantService } from "@/src/lib/ai/operations-assistant";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { input } = body;

    const service = new OperationsAssistantService();
    const recommendations = await service.analyzeOperations(input || "");
    const dashboardData = service.getDashboardData();

    return NextResponse.json({ recommendations, dashboardData });
  } catch (error) {
    console.error("Operations API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const service = new OperationsAssistantService();
    const dashboardData = service.getDashboardData();
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Operations API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
