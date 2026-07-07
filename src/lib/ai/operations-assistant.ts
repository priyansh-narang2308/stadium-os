import { OperationsRecommendation } from '@/src/types';
import { GATE_DATA, CROWD_DATA, WEATHER_DATA } from '@/src/lib/database/simulated-data';

export class OperationsAssistantService {
  async analyzeOperations(
    operatorInput: string
  ): Promise<OperationsRecommendation[]> {
    const lowerInput = operatorInput.toLowerCase();
    const recommendations: OperationsRecommendation[] = [];

    if (lowerInput.includes('gate a') && lowerInput.includes('queue')) {
      recommendations.push({
        recommendation: 'Open additional security lane at Gate A.',
        reasoning: 'Queue increased 42% in the last 10 minutes. Current wait time is 12 minutes.',
        expectedImpact: 'Reduce waiting time by approximately 18 minutes.',
        priority: 'high'
      });
    }

    if (lowerInput.includes('gate c') || lowerInput.includes('crowded')) {
      recommendations.push({
        recommendation: 'Redirect incoming fans to Gate B.',
        reasoning: 'Gate C density is at 85%, Gate B is only at 35% capacity.',
        expectedImpact: 'Balance crowd distribution and reduce wait times by 60%.',
        priority: 'critical'
      });
    }

    recommendations.push({
      recommendation: 'Monitor East Concourse crowd levels.',
      reasoning: 'Current density at 45%, approaching threshold.',
      expectedImpact: 'Prevent overcrowding before it becomes an issue.',
      priority: 'medium'
    });

    return recommendations;
  }

  getDashboardData() {
    return {
      gates: GATE_DATA,
      crowd: CROWD_DATA,
      weather: WEATHER_DATA
    };
  }
}
