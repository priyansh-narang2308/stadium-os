/* eslint-disable @typescript-eslint/no-explicit-any */
import { FanAssistantResponse, User } from "@/src/types";
import {
  CROWD_DATA,
  GATE_DATA,
  FACILITIES,
} from "@/src/lib/database/simulated-data";
import { GoogleGenAI } from "@google/genai";

export class FanAssistantService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({});
  }

  async processQuery(
    userQuery: string,
    user: User,
  ): Promise<FanAssistantResponse> {
    const context = this.buildContext(user);
    const response = await this.generateResponse(userQuery, context, user);
    return response;
  }

  private buildContext(user: User) {
    return {
      currentCrowdData: CROWD_DATA,
      gateData: GATE_DATA,
      facilities: FACILITIES,
      userPreferences: user.accessibilityPreferences,
    };
  }

  private async generateResponse(
    query: string,
    context: any,
    user: User,
  ): Promise<FanAssistantResponse> {
    const prompt = `You are a friendly stadium fan assistant. Help the user navigate and enjoy their stadium experience.

Use the following context to answer:
- Crowd Data: ${JSON.stringify(context.currentCrowdData)}
- Gate Data: ${JSON.stringify(context.gateData)}
- Available Facilities: ${JSON.stringify(context.facilities)}
- User Accessibility Preferences: ${JSON.stringify(context.userPreferences)}

User Query: "${query}"

Respond with ONLY a JSON object in this EXACT format:
{
  "navigationInstructions": "string or null",
  "estimatedWalkingTime": "number or null",
  "crowdWarnings": ["string"],
  "nearbyFacilities": [facility objects from context],
  "accessibilityNotes": "string or null",
  "rawResponse": "friendly natural language response"
}

Make sure rawResponse is friendly and conversational, and navigationInstructions gives clear directions if needed.`;

    try {
      const interaction = await this.ai.interactions.create({
        model: "gemini-3.5-flash",
        input: prompt,
      });

      const outputText = interaction.output_text || "";
      const jsonMatch = outputText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return {
          navigationInstructions:
            parsedResponse.navigationInstructions || undefined,
          estimatedWalkingTime:
            parsedResponse.estimatedWalkingTime || undefined,
          crowdWarnings: parsedResponse.crowdWarnings || [],
          nearbyFacilities: parsedResponse.nearbyFacilities || [],
          accessibilityNotes: parsedResponse.accessibilityNotes || undefined,
          rawResponse: parsedResponse.rawResponse || outputText,
        };
      }
    } catch (error) {
      console.error("Error calling Google GenAI:", error);
    }

    // Fallback to simple response if anything fails
    return {
      rawResponse: `How can I assist you with your stadium experience today?`,
    };
  }
}
