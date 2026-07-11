import { describe, it, expect, beforeEach } from 'vitest';
import { VolunteerAssistantService } from './volunteer-assistant';
import { User } from '@/src/types';

describe('VolunteerAssistantService', () => {
  let service: VolunteerAssistantService;
  let mockUser: User;

  beforeEach(() => {
    service = new VolunteerAssistantService();
    mockUser = {
      id: 'volunteer-001',
      role: 'volunteer',
      language: 'en',
    };
  });

  describe('getGuidance', () => {
    it('should return guidance with required properties', async () => {
      const result = await service.getGuidance(
        'Where should I guide wheelchair users?',
        mockUser
      );
      expect(result).toHaveProperty('guidance');
      expect(result).toHaveProperty('steps');
      expect(Array.isArray(result.steps)).toBe(true);
    });

    it('should handle emergency queries', async () => {
      const result = await service.getGuidance(
        'What is the emergency evacuation procedure?',
        mockUser
      );
      expect(result).toHaveProperty('guidance');
      expect(result).toHaveProperty('emergencyContact');
    });

    it('should handle lost child queries', async () => {
      const result = await service.getGuidance(
        'A child is lost, what do I do?',
        mockUser
      );
      expect(result).toHaveProperty('guidance');
      expect(result).toHaveProperty('steps');
    });

    it('should return fallback response on error', async () => {
      const result = await service.getGuidance('Test', mockUser);
      expect(result).toHaveProperty('guidance');
      expect(result).toHaveProperty('steps');
      expect(result.steps.length).toBeGreaterThan(0);
    });

    it('should include emergency contact in response', async () => {
      const result = await service.getGuidance('Test', mockUser);
      expect(result).toHaveProperty('emergencyContact');
      expect(typeof result.emergencyContact).toBe('string');
    });
  });
});
