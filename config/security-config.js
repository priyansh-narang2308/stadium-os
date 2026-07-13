// Production Security Configuration
const config = {
  // CORS Configuration
  CORS: {
    origins: ['https://stadiumos.ai', 'https://admin.stadiumos.ai'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    maxAge: 86400,
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  },

  // JWT Configuration
  JWT: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d',
    algorithm: 'HS256',
    issuer: 'stadiumos.ai',
    audience: 'stadiumos-clients',
  },

  // Rate Limiting Configuration
  RATE_LIMIT: {
    windowMs: 60000,
    maxRequests: 60,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    keyGenerator: (req) => req.ip || 'unknown',
    message: 'Too many requests from this IP, please try again later.',
  },

  // Security Headers
  SECURITY_HEADERS: {
    CONTENT_SECURITY_POLICY: "default-src 'self'; script-src 'self' 'unsafe-eval' 'nonce-' + nonce + '; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
    X_FRAME_OPTIONS: 'DENY',
    X_CONTENT_TYPE_OPTIONS: 'nosniff',
    REFERER_POLICY: 'strict-origin-when-cross-origin',
    PERMISSIONS_POLICY: 'camera=(), microphone=(), geolocation()',
    STRICT_TRANSPORT_SECURITY: 'max-age=31536000; includeSubDomains; preload',
    X_XSS_PROTECTION: '1; mode=block',
    XXSS_PROTECTION: '1; mode=block',
  },

  // Input Validation
  VALIDATION: {
    MAX_INPUT_LENGTH: 1000,
    MAX_BODY_SIZE: '10kb',
    ALLOWED_CONTENT_TYPES: ['application/json'],
    forta: {
      ignore: [],
      allowlist: [],
      blocklist: ['script', 'javascript', 'vbscript'],
    },
  },

  // Session Security
  SESSION: {
    cookieName: 'stadiumos_session',
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 86400000,
    rolling: true,
  },
};

export default config;