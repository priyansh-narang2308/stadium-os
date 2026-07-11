/**
 * Application Constants
 * Centralized configuration values to avoid magic numbers and strings
 */

// Rate Limiting
export const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 60;
export const RATE_LIMIT_HEADERS = {
  'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
  'X-RateLimit-Remaining': '60',
  'X-RateLimit-Reset': '60',
} as const;

// API Configuration
export const API_TIMEOUT_MS = 30000; // 30 seconds
export const MAX_INPUT_LENGTH = 1000;
export const MAX_QUERY_LENGTH = 500;

// Stadium Configuration
export const STADIUM_CAPACITY = 80000;
export const HIGH_CROWD_THRESHOLD = 75; // percentage
export const CRITICAL_CROWD_THRESHOLD = 90; // percentage

// Cache Configuration
export const CACHE_TTL_MS = 300000; // 5 minutes
export const CROWD_DATA_CACHE_TTL_MS = 30000; // 30 seconds (real-time data)

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Accessibility
export const WCAG_AA_CONTRAST_RATIO = 4.5;
export const WCAG_AA_LARGE_CONTRAST_RATIO = 3;

// Animation
export const ANIMATION_DURATION_MS = 300;
export const TRANSITION_DURATION_MS = 200;

// File Upload
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

// Session
export const SESSION_DURATION_MS = 3600000; // 1 hour
export const TOKEN_REFRESH_THRESHOLD_MS = 300000; // 5 minutes before expiry

// Weather
export const WEATHER_UPDATE_INTERVAL_MS = 600000; // 10 minutes

// Emergency
export const EMERGENCY_CONTACT_NUMBER = '+1 (555) 123-4567';
export const EMERGENCY_RESPONSE_TIME_MS = 30000; // 30 seconds target response time
