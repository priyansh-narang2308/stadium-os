import { z } from 'zod';

// User schemas
export const UserRoleSchema = z.enum(['fan', 'operator', 'volunteer']);

export const AccessibilityPreferencesSchema = z.object({
  wheelchair: z.boolean().default(false),
  visualImpairment: z.boolean().default(false),
  hearingImpairment: z.boolean().default(false),
});

export const UserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  role: UserRoleSchema,
  language: z.string().min(2).max(10).default('en'),
  accessibilityPreferences: AccessibilityPreferencesSchema.optional(),
});

// API Request schemas
export const FanAssistantRequestSchema = z.object({
  query: z.string().min(1, 'Query is required').max(1000, 'Query too long'),
  user: UserSchema.optional(),
});

export const OperationsRequestSchema = z.object({
  input: z.string().max(500, 'Input too long').optional(),
});

export const VolunteerRequestSchema = z.object({
  query: z.string().min(1, 'Query is required').max(1000, 'Query too long'),
  user: UserSchema.optional(),
});

// Facility schema
export const FacilitySchema = z.object({
  id: z.string(),
  stadiumId: z.string(),
  type: z.enum(['restroom', 'food', 'merchandise', 'first-aid', 'entrance', 'exit', 'elevator', 'escalator']),
  name: z.string(),
  location: z.string(),
  accessibilityAvailable: z.boolean(),
  currentWaitTime: z.number().optional(),
});

// Response schemas
export const FanAssistantResponseSchema = z.object({
  navigationInstructions: z.string().nullable().optional(),
  estimatedWalkingTime: z.number().nullable().optional(),
  crowdWarnings: z.array(z.string()).optional(),
  nearbyFacilities: z.array(FacilitySchema).optional(),
  accessibilityNotes: z.string().nullable().optional(),
  rawResponse: z.string(),
});

export const PriorityLevelSchema = z.enum(['low', 'medium', 'high', 'critical']);

export const OperationsRecommendationSchema = z.object({
  recommendation: z.string(),
  reasoning: z.string(),
  expectedImpact: z.string(),
  priority: PriorityLevelSchema,
});

export const VolunteerAssistantResponseSchema = z.object({
  guidance: z.string(),
  steps: z.array(z.string()),
  nearbyResources: z.array(FacilitySchema).optional(),
  emergencyContact: z.string().optional(),
});

// Environment validation
export const EnvSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});
