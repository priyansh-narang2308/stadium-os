import { FanAssistantResponse, User, Facility } from "@/src/types";
import {
  CROWD_DATA,
  GATE_DATA,
  FACILITIES,
} from "@/src/lib/database/simulated-data";
import { GoogleGenAI } from "@google/genai";
import { 
  FAN_ASSISTANT_SYSTEM_PROMPT, 
  FAN_ASSISTANT_RESPONSE_FORMAT,
  AI_CONFIG,
} from "@/src/lib/config/ai-config";
import { logger } from "@/src/lib/logger";
import { MAX_INPUT_LENGTH } from "@/src/lib/constants";

interface ContextData {
  currentCrowdData: typeof CROWD_DATA;
  gateData: typeof GATE_DATA;
  facilities: typeof FACILITIES;
  userPreferences: User['accessibilityPreferences'];
}

interface AIResponse {
  navigationInstructions?: string | null;
  estimatedWalkingTime?: number | null;
  crowdWarnings?: string[];
  nearbyFacilities?: Facility[];
  accessibilityNotes?: string | null;
  rawResponse: string;
}

export class FanAssistantService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async processQuery(
    userQuery: string,
    user: User,
  ): Promise<FanAssistantResponse> {
    logger.info('Processing fan assistant query', { queryLength: userQuery.length });
    
    if (userQuery.length > MAX_INPUT_LENGTH) {
      throw new Error(`Query exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
    }

    const context = this.buildContext(user);
    const response = await this.generateResponse(userQuery, context);
    
    logger.info('Fan assistant query processed successfully');
    return response;
  }

  private buildContext(user: User): ContextData {
    return {
      currentCrowdData: CROWD_DATA,
      gateData: GATE_DATA,
      facilities: FACILITIES,
      userPreferences: user.accessibilityPreferences,
    };
  }

  private async generateResponse(
    query: string,
    context: ContextData,
  ): Promise<FanAssistantResponse> {
    const prompt = `${FAN_ASSISTANT_SYSTEM_PROMPT}

Use the following context to answer:
- Crowd Data: ${JSON.stringify(context.currentCrowdData)}
- Gate Data: ${JSON.stringify(context.gateData)}
- Available Facilities: ${JSON.stringify(context.facilities)}
- User Accessibility Preferences: ${JSON.stringify(context.userPreferences)}

User Query: "${query}"

${FAN_ASSISTANT_RESPONSE_FORMAT}`;

    try {
      const interaction = await this.ai.interactions.create({
        model: AI_CONFIG.FAN_MODEL,
        input: prompt,
      });

      const outputText = interaction.output_text || "";
      const jsonMatch = outputText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const parsedResponse: AIResponse = JSON.parse(jsonMatch[0]);
        return {
          navigationInstructions: parsedResponse.navigationInstructions || undefined,
          estimatedWalkingTime: parsedResponse.estimatedWalkingTime || undefined,
          crowdWarnings: parsedResponse.crowdWarnings || [],
          nearbyFacilities: parsedResponse.nearbyFacilities || [],
          accessibilityNotes: parsedResponse.accessibilityNotes || undefined,
          rawResponse: parsedResponse.rawResponse || outputText,
        };
      }
    } catch (error) {
      logger.error('Error calling Google GenAI for fan assistant', error as Error);
      logger.warn('Falling back to default response');
    }

    // Fallback to simple response if anything fails
    logger.warn('Using fallback response for fan assistant');
    return {
      rawResponse: `How can I assist you with your stadium experience today?`,
    };
  }
}
