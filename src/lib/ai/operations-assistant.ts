import { OperationsRecommendation } from '@/src/types';
import { GATE_DATA, CROWD_DATA, WEATHER_DATA } from '@/src/lib/database/simulated-data';
import { GoogleGenAI } from "@google/genai";

export class OperationsAssistantService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({});
  }

  async analyzeOperations(
    operatorInput: string
  ): Promise<OperationsRecommendation[]> {
    const prompt = `You are a stadium operations assistant. Analyze the stadium data and provide actionable recommendations.

Current Stadium Data:
- Gate Data: ${JSON.stringify(GATE_DATA)}
- Crowd Data: ${JSON.stringify(CROWD_DATA)}
- Weather Data: ${JSON.stringify(WEATHER_DATA)}

Operator Query: "${operatorInput}"

Respond with ONLY a JSON array of operations recommendations in this EXACT format:
[
  {
    "recommendation": "string",
    "reasoning": "string",
    "expectedImpact": "string",
    "priority": "low" | "medium" | "high" | "critical"
  }
]

Provide 2-4 relevant recommendations based on the data and query.`;

    try {
      const interaction = await this.ai.interactions.create({
        model: "gemini-3.5-flash",
        input: prompt,
      });

      const outputText = interaction.output_text || "";
      const jsonMatch = outputText.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error("Error calling Google GenAI:", error);
    }

    // Fallback recommendations
    return [
      {
        recommendation: 'Monitor East Concourse crowd levels.',
        reasoning: 'Current density at 45%, approaching threshold.',
        expectedImpact: 'Prevent overcrowding before it becomes an issue.',
        priority: 'medium'
      }
    ];
  }

  getDashboardData() {
    return {
      gates: GATE_DATA,
      crowd: CROWD_DATA,
      weather: WEATHER_DATA
    };
  }
}
