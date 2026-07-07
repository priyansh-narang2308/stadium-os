import { VolunteerAssistantResponse, User, Facility } from "@/src/types";
import { FACILITIES } from "@/src/lib/database/simulated-data";
import { GoogleGenAI } from "@google/genai";

export class VolunteerAssistantService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({});
  }

  async getGuidance(
    volunteerQuery: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _volunteer: User,
  ): Promise<VolunteerAssistantResponse> {
    const prompt = `You are a helpful stadium volunteer assistant. Guide volunteers on how to assist fans.

Available Facilities: ${JSON.stringify(FACILITIES)}

Volunteer Query: "${volunteerQuery}"

Respond with ONLY a JSON object in this EXACT format:
{
  "guidance": "string",
  "steps": ["string"],
  "nearbyResources": [facility objects from context or empty array],
  "emergencyContact": "Stadium Security: +1 (555) 123-4567"
}

Make sure guidance is clear and actionable, and steps are a numbered list of actions.`;

    try {
      const interaction = await this.ai.interactions.create({
        model: "gemini-flash-latest",
        input: prompt,
      });

      const outputText = interaction.output_text || "";
      const jsonMatch = outputText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error("Error calling Google GenAI:", error);
    }

    // Fallback response
    return {
      guidance: "How can I help you assist fans today?",
      steps: [
        "Greet the fan politely",
        "Listen carefully to their question",
        "Provide clear directions",
        "Offer additional assistance if needed",
      ],
      nearbyResources: [],
      emergencyContact: "Stadium Security: +1 (555) 123-4567",
    };
  }
}
