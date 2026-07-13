import { OperationsRecommendation, PriorityLevel } from "@/src/types";
import {
  GATE_DATA,
  CROWD_DATA,
  WEATHER_DATA,
} from "@/src/lib/database/simulated-data";
import { GoogleGenAI } from "@google/genai";
import { 
  OPERATIONS_ASSISTANT_SYSTEM_PROMPT,
  OPERATIONS_ASSISTANT_RESPONSE_FORMAT,
  AI_CONFIG,
} from "@/src/lib/config/ai-config";
import { logger } from "@/src/lib/logger";
import { MAX_QUERY_LENGTH } from "@/src/lib/constants";
import { apiCache } from "@/src/lib/utils/cache";

interface AIRecommendation {
  recommendation: string;
  reasoning: string;
  expectedImpact: string;
  priority: PriorityLevel;
}

export class OperationsAssistantService {
  private ai: GoogleGenAI;

  constructor(ai?: GoogleGenAI) {
    this.ai = ai || new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async analyzeOperations(
    operatorInput: string,
  ): Promise<OperationsRecommendation[]> {
    logger.info('Analyzing operations data', { inputLength: operatorInput.length });
    
    if (operatorInput.length > MAX_QUERY_LENGTH) {
      throw new Error(`Input exceeds maximum length of ${MAX_QUERY_LENGTH} characters`);
    }

    const cacheKey = `ops:${operatorInput}`;
    const cached = apiCache.get(cacheKey) as OperationsRecommendation[] | null;
    if (cached) {
      logger.info('Returning cached operations analysis');
      return cached;
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
        model: AI_CONFIG.OPERATIONS_MODEL,
        input: prompt,
      });

      const outputText = interaction.output_text || "";
      const jsonMatch = outputText.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        const parsedResponse: AIRecommendation[] = JSON.parse(jsonMatch[0]);
        logger.info('Operations analysis completed', { recommendationCount: parsedResponse.length });
        apiCache.set(cacheKey, parsedResponse, 60000); // Cache for 1 minute
        return parsedResponse;
      }
    } catch (error) {
      logger.error('Error calling Google GenAI for operations analysis', error as Error);
      logger.warn('Falling back to default recommendations');
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
