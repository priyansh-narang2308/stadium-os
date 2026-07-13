/**
 * AI Service Configuration
 * Centralized prompts and configuration
 */

// AI Model Configuration
export const AI_CONFIG = {
  FAN_MODEL: 'gemini-flash-latest',
  OPERATIONS_MODEL: 'gemini-flash-latest',
  VOLUNTEER_MODEL: 'gemini-flash-latest',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  TIMEOUT_MS: 30000,
} as const;

// Staging/Prompts for AI responses
export const AI_PROMPTS = {
  FAN_ASSISTANT_SYSTEM_PROMPT: `You are a friendly stadium fan assistant for FIFA World Cup 2026. Help fans navigate and enjoy their stadium experience.

Your role is to:
- Provide clear, step-by-step navigation instructions
- Suggest optimal routes considering crowd density
- Recommend nearby facilities (restrooms, food, first aid)
- Highlight accessibility features when relevant
- Warn about congested areas
- Be conversational and helpful

Always consider the user's accessibility preferences in your recommendations.`,

  OPERATIONS_ASSISTANT_SYSTEM_PROMPT: `You are a stadium operations intelligence assistant for FIFA World Cup 2026.

Your role is to:
- Analyze real-time stadium data (crowd density, gate queues, weather)
- Provide actionable operational recommendations
- Prioritize recommendations by urgency (critical/high/medium/low)
- Consider safety, efficiency, and fan experience
- Support data-driven decision making

Focus on:
- Crowd management
- Resource allocation
- Safety concerns
- Operational efficiency`,

  VOLUNTEER_ASSISTANT_SYSTEM_PROMPT: `You are a stadium volunteer assistant for FIFA World Cup 2026.

Your role is to:
- Guide volunteers on how to assist fans
- Provide emergency procedures and protocols
- Explain accessibility accommodations
- Support fan inquiries
- Coordinate with stadium operations

Focus on:
- Clear, actionable steps
- Safety protocols
- Accessibility support
- Emergency response`,
} as const;

// Response Format Templates
export const RESPONSE_FORMATS = {
  FAN_ASSISTANT: {
    schema: {
      navigationInstructions: 'string | null - clear step-by-step directions',
      estimatedWalkingTime: 'number | null - estimated time in minutes',
      crowdWarnings: '[] - list of congestion warnings if applicable',
      nearbyFacilities: '[facility objects] - relevant facilities from context',
      accessibilityNotes: 'string | null - accessibility information if relevant',
      rawResponse: 'string - friendly natural language response for the user',
    },
    examples: [
      {
        navigationInstructions: 'Head north to Block 124, there are 3 open lanes at Gate A',
        estimatedWalkingTime: 5,
        crowdWarnings: ['Crowd density high near Gate C (85%)'],
        nearbyFacilities: [],
        accessibilityNotes: 'Elevator available on East Concourse',
        rawResponse: 'You can reach your seat in about 5 minutes heading north...',
      },
    ],
  },

  OPERATIONS_ASSISTANT: {
    schema: {
      recommendation: 'string - specific actionable recommendation',
      reasoning: 'string - data-driven explanation',
      expectedImpact: 'string - expected outcome',
      priority: ['low', 'medium', 'high', 'critical'],
    },
    examples: [
      {
        recommendation: 'Open additional lanes at Gate A',
        reasoning: 'Current queue length 45 with 3 open lanes, approaching threshold',
        expectedImpact: 'Reduce wait time from 12 to 5 minutes',
        priority: 'high',
      },
    ],
  },

  VOLUNTEER_ASSISTANT: {
    schema: {
      guidance: 'string - clear guidance for the volunteer',
      steps: ['string[] - numbered list of actions to take'],
      nearbyResources: '[facility objects] - relevant facilities or empty array',
      emergencyContact: 'string - emergency contact information',
    },
    examples: [
      {
        guidance: 'Guide wheelchair user to accessible entrance via elevator on East Concourse',
        steps: [
          'Check if elevator is operational',
          'Locate wheelchair-accessible route',
          'Guide user to elevator',
          'Navigate to destination',
        ],
        nearbyResources: [],
        emergencyContact: 'Stadium Security: +1 (555) 123-4567',
      },
    ],
  },
} as const;

// Validation Constants
export const VALIDATION_RULES = {
  MAX_INPUT_LENGTH: 1000,
  MAX_QUERY_LENGTH: 500,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
} as const;
