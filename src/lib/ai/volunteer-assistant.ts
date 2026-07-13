import { VolunteerAssistantResponse, Facility } from "@/src/types";
import { FACILITIES } from "@/src/lib/database/simulated-data";
import { GoogleGenAI } from "@google/genai";
import { 
  VOLUNTEER_ASSISTANT_SYSTEM_PROMPT,
  VOLUNTEER_ASSISTANT_RESPONSE_FORMAT,
  AI_CONFIG,
} from "@/src/lib/config/ai-config";
import { logger } from "@/src/lib/logger";
import { MAX_INPUT_LENGTH } from "@/src/lib/constants";

interface AIResponse {
  guidance: string;
  steps: string[];
  nearbyResources: Facility[];
  emergencyContact: string;
}

export class VolunteerAssistantService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async getGuidance(
    volunteerQuery: string,
  ): Promise<VolunteerAssistantResponse> {
    logger.info('Processing volunteer guidance query', { queryLength: volunteerQuery.length });
    
    if (volunteerQuery.length > MAX_INPUT_LENGTH) {
      throw new Error(`Query exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
    }

    const prompt = `${VOLUNTEER_ASSISTANT_SYSTEM_PROMPT}

Available Facilities: ${JSON.stringify(FACILITIES)}

Volunteer Query: "${volunteerQuery}"

${VOLUNTEER_ASSISTANT_RESPONSE_FORMAT}`;

    try {
      const interaction = await this.ai.interactions.create({
        model: AI_CONFIG.VOLUNTEER_MODEL,
        input: prompt,
      });

      const outputText = interaction.output_text || "";
      const jsonMatch = outputText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const parsedResponse: AIResponse = JSON.parse(jsonMatch[0]);
        logger.info('Volunteer guidance processed successfully');
        return {
          guidance: parsedResponse.guidance,
          steps: parsedResponse.steps,
          nearbyResources: parsedResponse.nearbyResources,
          emergencyContact: parsedResponse.emergencyContact,
        };
      }
    } catch (error) {
      logger.error('Error calling Google GenAI for volunteer assistant', error as Error);
      logger.warn('Falling back to default response');
    }

    // Fallback response
    logger.warn('Using fallback response for volunteer assistant');
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
