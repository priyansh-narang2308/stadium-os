import { describe, it, expect, beforeEach } from 'vitest';
import { VolunteerAssistantService } from './volunteer-assistant';

describe('VolunteerAssistantService', () => {
  let service: VolunteerAssistantService;

  beforeEach(() => {
    service = new VolunteerAssistantService();
  });

  describe('getGuidance', () => {
    it('should return guidance with required properties', async () => {
      const result = await service.getGuidance(
        'Where should I guide wheelchair users?'
      );
      expect(result).toHaveProperty('guidance');
      expect(result).toHaveProperty('steps');
      expect(Array.isArray(result.steps)).toBe(true);
    });

    it('should handle emergency queries', async () => {
      const result = await service.getGuidance(
        'What is the emergency evacuation procedure?'
      );
      expect(result).toHaveProperty('guidance');
      expect(result).toHaveProperty('emergencyContact');
    });

    it('should handle lost child queries', async () => {
      const result = await service.getGuidance(
        'A child is lost, what do I do?'
      );
      expect(result).toHaveProperty('guidance');
      expect(result).toHaveProperty('steps');
    });

    it('should return fallback response on error', async () => {
      const result = await service.getGuidance('Test');
      expect(result).toHaveProperty('guidance');
      expect(result).toHaveProperty('steps');
      expect(result.steps.length).toBeGreaterThan(0);
    });

    it('should include emergency contact in response', async () => {
      const result = await service.getGuidance('Test');
      expect(result).toHaveProperty('emergencyContact');
      expect(typeof result.emergencyContact).toBe('string');
    });
  });
});
