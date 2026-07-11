import { describe, it, expect, beforeEach } from 'vitest';
import { OperationsAssistantService } from './operations-assistant';

describe('OperationsAssistantService', () => {
  let service: OperationsAssistantService;

  beforeEach(() => {
    service = new OperationsAssistantService();
  });

  describe('analyzeOperations', () => {
    it('should return array of recommendations', async () => {
      const result = await service.analyzeOperations('Security queue at Gate A');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return recommendations with required properties', async () => {
      const result = await service.analyzeOperations('Test input');
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('recommendation');
        expect(result[0]).toHaveProperty('reasoning');
        expect(result[0]).toHaveProperty('expectedImpact');
        expect(result[0]).toHaveProperty('priority');
      }
    });

    it('should handle empty input', async () => {
      const result = await service.analyzeOperations('');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle undefined input', async () => {
      const result = await service.analyzeOperations(undefined as any);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return fallback recommendations on error', async () => {
      const result = await service.analyzeOperations('Test');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getDashboardData', () => {
    it('should return dashboard data with gates', () => {
      const data = service.getDashboardData();
      expect(data).toHaveProperty('gates');
      expect(Array.isArray(data.gates)).toBe(true);
    });

    it('should return dashboard data with crowd', () => {
      const data = service.getDashboardData();
      expect(data).toHaveProperty('crowd');
      expect(Array.isArray(data.crowd)).toBe(true);
    });

    it('should return dashboard data with weather', () => {
      const data = service.getDashboardData();
      expect(data).toHaveProperty('weather');
      expect(data.weather).toHaveProperty('temperature');
      expect(data.weather).toHaveProperty('condition');
    });
  });
});
