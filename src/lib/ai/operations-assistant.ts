import { OperationsRecommendation, PriorityLevel } from "@/src/types";
import {
  GATE_DATA,
  CROWD_DATA,
  WEATHER_DATA,
} from "@/src/lib/database/simulated-data";
import { GoogleGenAI } from "@google/genai";
import { 
  OPERATIONS_ASSISTANT_SYSTEM_PROMPT,
  OPERATIONS_ASSISTANT_RESPONSE_FORMAT 
} from "@/src/lib/config/prompts";
import { ExternalServiceError } from "@/src/lib/errors";
import { logger } from "@/src/lib/logger";
import { MAX_QUERY_LENGTH } from "@/src/lib/constants";

interface AIRecommendation {
  recommendation: string;
  reasoning: string;
  expectedImpact: string;
  priority: PriorityLevel;
}

export class OperationsAssistantService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({});
  }

  async analyzeOperations(
    operatorInput: string,
  ): Promise<OperationsRecommendation[]> {
    logger.info('Analyzing operations data', { inputLength: operatorInput.length });
    
    if (operatorInput.length > MAX_QUERY_LENGTH) {
      throw new Error(`Input exceeds maximum length of ${MAX_QUERY_LENGTH} characters`);
    }

    const prompt = `${OPERATIONS_ASSISTANT_SYSTEM_PROMPT}

Current Stadium Data:
- Gate Data: ${JSON.stringify(GATE_DATA)}
- Crowd Data: ${JSON.stringify(CROWD_DATA)}
- Weather Data: ${JSON.stringify(WEATHER_DATA)}

Operator Query: "${operatorInput}"

${OPERATIONS_ASSISTANT_RESPONSE_FORMAT}`;

    try {
      const interaction = await this.ai.interactions.create({
        model: "gemini-flash-latest",
        input: prompt,
      });

      const outputText = interaction.output_text || "";
      const jsonMatch = outputText.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        const parsedResponse: AIRecommendation[] = JSON.parse(jsonMatch[0]);
        logger.info('Operations analysis completed', { recommendationCount: parsedResponse.length });
        return parsedResponse;
      }
    } catch (error) {
      logger.error('Error calling Google GenAI for operations analysis', error as Error);
      throw new ExternalServiceError('Google GenAI', 'Failed to generate operations recommendations');
    }

    // Fallback recommendations
    logger.warn('Using fallback recommendations for operations analysis');
    return [
      {
        recommendation: "Monitor East Concourse crowd levels.",
        reasoning: "Current density at 45%, approaching threshold.",
        expectedImpact: "Prevent overcrowding before it becomes an issue.",
        priority: "medium",
      },
    ];
  }

  getDashboardData() {
    return {
      gates: GATE_DATA,
      crowd: CROWD_DATA,
      weather: WEATHER_DATA,
    };
  }
}
