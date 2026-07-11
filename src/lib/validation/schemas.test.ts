import { describe, it, expect } from 'vitest';
import {
  UserRoleSchema,
  AccessibilityPreferencesSchema,
  UserSchema,
  FanAssistantRequestSchema,
  OperationsRequestSchema,
  VolunteerRequestSchema,
  FanAssistantResponseSchema,
  OperationsRecommendationSchema,
  VolunteerAssistantResponseSchema,
  EnvSchema,
} from './schemas';

describe('Validation Schemas', () => {
  describe('UserRoleSchema', () => {
    it('should accept valid user roles', () => {
      expect(UserRoleSchema.parse('fan')).toBe('fan');
      expect(UserRoleSchema.parse('operator')).toBe('operator');
      expect(UserRoleSchema.parse('volunteer')).toBe('volunteer');
    });

    it('should reject invalid user roles', () => {
      expect(() => UserRoleSchema.parse('invalid')).toThrow();
    });
  });

  describe('AccessibilityPreferencesSchema', () => {
    it('should accept valid accessibility preferences', () => {
      const result = AccessibilityPreferencesSchema.parse({
        wheelchair: true,
        visualImpairment: false,
        hearingImpairment: true,
      });
      expect(result).toEqual({
        wheelchair: true,
        visualImpairment: false,
        hearingImpairment: true,
      });
    });

    it('should provide default values', () => {
      const result = AccessibilityPreferencesSchema.parse({});
      expect(result).toEqual({
        wheelchair: false,
        visualImpairment: false,
        hearingImpairment: false,
      });
    });
  });

  describe('UserSchema', () => {
    it('should accept valid user data', () => {
      const result = UserSchema.parse({
        id: 'user-123',
        role: 'fan',
        language: 'en',
        accessibilityPreferences: {
          wheelchair: true,
          visualImpairment: false,
          hearingImpairment: false,
        },
      });
      expect(result.id).toBe('user-123');
      expect(result.role).toBe('fan');
    });

    it('should reject invalid user data', () => {
      expect(() =>
        UserSchema.parse({
          id: '',
          role: 'fan',
          language: 'en',
        })
      ).toThrow();
    });

    it('should provide default language', () => {
      const result = UserSchema.parse({
        id: 'user-123',
        role: 'fan',
      });
      expect(result.language).toBe('en');
    });
  });

  describe('FanAssistantRequestSchema', () => {
    it('should accept valid fan assistant request', () => {
      const result = FanAssistantRequestSchema.parse({
        query: 'Where is the nearest restroom?',
        user: {
          id: 'user-123',
          role: 'fan',
          language: 'en',
        },
      });
      expect(result.query).toBe('Where is the nearest restroom?');
    });

    it('should reject empty query', () => {
      expect(() =>
        FanAssistantRequestSchema.parse({
          query: '',
        })
      ).toThrow();
    });

    it('should reject query longer than 1000 characters', () => {
      const longQuery = 'a'.repeat(1001);
      expect(() =>
        FanAssistantRequestSchema.parse({
          query: longQuery,
        })
      ).toThrow();
    });
  });

  describe('OperationsRequestSchema', () => {
    it('should accept valid operations request', () => {
      const result = OperationsRequestSchema.parse({
        input: 'Security queue at Gate A increased',
      });
      expect(result.input).toBe('Security queue at Gate A increased');
    });

    it('should accept request without input', () => {
      const result = OperationsRequestSchema.parse({});
      expect(result.input).toBeUndefined();
    });
  });

  describe('VolunteerRequestSchema', () => {
    it('should accept valid volunteer request', () => {
      const result = VolunteerRequestSchema.parse({
        query: 'Where should I guide wheelchair users?',
        user: {
          id: 'volunteer-001',
          role: 'volunteer',
          language: 'en',
        },
      });
      expect(result.query).toBe('Where should I guide wheelchair users?');
    });

    it('should reject empty query', () => {
      expect(() =>
        VolunteerRequestSchema.parse({
          query: '',
        })
      ).toThrow();
    });
  });

  describe('FanAssistantResponseSchema', () => {
    it('should accept valid fan assistant response', () => {
      const result = FanAssistantResponseSchema.parse({
        rawResponse: 'Go straight ahead and turn left at the concession stand.',
        navigationInstructions: 'Go straight ahead, turn left at concession stand',
        estimatedWalkingTime: 5,
        crowdWarnings: ['Gate C is congested'],
        nearbyFacilities: [],
        accessibilityNotes: 'Route is wheelchair accessible',
      });
      expect(result.rawResponse).toBeDefined();
    });

    it('should accept minimal response', () => {
      const result = FanAssistantResponseSchema.parse({
        rawResponse: 'How can I help you?',
      });
      expect(result.rawResponse).toBe('How can I help you?');
    });
  });

  describe('OperationsRecommendationSchema', () => {
    it('should accept valid recommendation', () => {
      const result = OperationsRecommendationSchema.parse({
        recommendation: 'Monitor East Concourse crowd levels',
        reasoning: 'Current density at 45%, approaching threshold',
        expectedImpact: 'Prevent overcrowding before it becomes an issue',
        priority: 'medium',
      });
      expect(result.priority).toBe('medium');
    });

    it('should reject invalid priority', () => {
      expect(() =>
        OperationsRecommendationSchema.parse({
          recommendation: 'Test',
          reasoning: 'Test',
          expectedImpact: 'Test',
          priority: 'invalid' as any,
        })
      ).toThrow();
    });
  });

  describe('VolunteerAssistantResponseSchema', () => {
    it('should accept valid volunteer response', () => {
      const result = VolunteerAssistantResponseSchema.parse({
        guidance: 'Guide wheelchair users to Gate B',
        steps: ['Greet the fan', 'Check accessibility needs', 'Provide directions'],
        nearbyResources: [],
        emergencyContact: 'Stadium Security: +1 (555) 123-4567',
      });
      expect(result.guidance).toBe('Guide wheelchair users to Gate B');
      expect(result.steps).toHaveLength(3);
    });
  });

  describe('EnvSchema', () => {
    it('should accept valid environment variables', () => {
      const result = EnvSchema.parse({
        GEMINI_API_KEY: 'test-api-key',
        NODE_ENV: 'development',
      });
      expect(result.GEMINI_API_KEY).toBe('test-api-key');
    });

    it('should provide default NODE_ENV', () => {
      const result = EnvSchema.parse({
        GEMINI_API_KEY: 'test-api-key',
      });
      expect(result.NODE_ENV).toBe('development');
    });

    it('should reject missing GEMINI_API_KEY', () => {
      expect(() =>
        EnvSchema.parse({
          NODE_ENV: 'development',
        })
      ).toThrow();
    });
  });
});
