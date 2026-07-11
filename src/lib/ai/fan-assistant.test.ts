import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FanAssistantService } from './fan-assistant';
import { User } from '@/src/types';

describe('FanAssistantService', () => {
  let service: FanAssistantService;
  let mockUser: User;

  beforeEach(() => {
    service = new FanAssistantService();
    mockUser = {
      id: 'user-123',
      role: 'fan',
      language: 'en',
      accessibilityPreferences: {
        wheelchair: false,
        visualImpairment: false,
        hearingImpairment: false,
      },
    };
  });

  describe('processQuery', () => {
    it('should return a response with rawResponse', async () => {
      const result = await service.processQuery('Hello', mockUser);
      expect(result).toHaveProperty('rawResponse');
      expect(typeof result.rawResponse).toBe('string');
    });

    it('should handle empty query', async () => {
      const result = await service.processQuery('', mockUser);
      expect(result).toHaveProperty('rawResponse');
    });

    it('should handle navigation queries', async () => {
      const result = await service.processQuery(
        'How do I get to Block 124?',
        mockUser
      );
      expect(result).toHaveProperty('rawResponse');
    });

    it('should handle facility queries', async () => {
      const result = await service.processQuery(
        'Where is the nearest restroom?',
        mockUser
      );
      expect(result).toHaveProperty('rawResponse');
    });

    it('should handle accessibility preferences', async () => {
      const accessibleUser: User = {
        ...mockUser,
        accessibilityPreferences: {
          wheelchair: true,
          visualImpairment: false,
          hearingImpairment: false,
        },
      };
      const result = await service.processQuery(
        'How do I get to my seat?',
        accessibleUser
      );
      expect(result).toHaveProperty('rawResponse');
    });
  });

  describe('buildContext', () => {
    it('should build context with user preferences', () => {
      const context = (service as any).buildContext(mockUser);
      expect(context).toHaveProperty('currentCrowdData');
      expect(context).toHaveProperty('gateData');
      expect(context).toHaveProperty('facilities');
      expect(context).toHaveProperty('userPreferences');
      expect(context.userPreferences).toEqual(
        mockUser.accessibilityPreferences
      );
    });
  });
});
