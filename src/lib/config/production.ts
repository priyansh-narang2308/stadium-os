export const FEATURE_FLAGS = {
  REDIS_ENABLED: false,
  CSRF_PROTECTION_ENABLED: true,
  RATE_LIMITING_ENABLED: true,
  AI_SERVICES_ENABLED: true,
} as const;

export const RATE_LIMIT_CONFIG = {
  IN_MEMORY_ENABLED: true,
  REDIS_ENABLED: false,
  WINDOW_MS: 60000,
  MAX_REQUESTS: 60,
} as const;

export const CSD_CONFIG = {
  ENABLED: true,
  FALLBACK_ENABLED: true,
  EXEMPT_PATHS: ['/api/health', '/_next/static'],
} as const;
