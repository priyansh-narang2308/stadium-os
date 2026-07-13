import { createHmac, randomBytes } from 'crypto';

function getCSRFSecret(): string {
  if (process.env.CSRF_SECRET) return process.env.CSRF_SECRET;
  if (process.env.NODE_ENV === 'production') {
    if (typeof window === 'undefined') {
      throw new Error('CSRF_SECRET environment variable is required in production');
    }
  }
  const generated = randomBytes(32).toString('hex');
  console.warn('[CSRF] CSRF_SECRET not set. Using ephemeral secret. All existing tokens invalidated on restart.');
  return generated;
}

let cachedSecret: string | null = null;
function getSecret(): string {
  if (!cachedSecret) cachedSecret = getCSRFSecret();
  return cachedSecret;
}
const TOKEN_VERSION = 1;

type CSRFClaims = {
  v: number;
  s: string;
  t: number;
};

function signClaims(claims: CSRFClaims): string {
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const sig = createHmac('sha256', getSecret()).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

function verifySignature(token: string): CSRFClaims | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payload, sig] = parts;
    const expectedSig = createHmac('sha256', getSecret()).update(payload).digest('hex');
    if (!sig || expectedSig.length !== sig.length) return null;

    const claims: CSRFClaims = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return claims;
  } catch {
    return null;
  }
}

export function generateCSRFToken(): string {
  const claims: CSRFClaims = {
    v: TOKEN_VERSION,
    s: randomBytes(16).toString('hex'),
    t: Date.now(),
  };
  return signClaims(claims);
}

export function validateCSRFToken(token: string, maxAgeMs: number = 3600000): boolean {
  if (!token || typeof token !== 'string') return false;

  const claims = verifySignature(token);
  if (!claims) return false;
  if (claims.v !== TOKEN_VERSION) return false;

  const tokenAge = Date.now() - claims.t;
  if (tokenAge >= maxAgeMs) return false;

  return true;
}

export function getCSRFTokenFromHeaders(headers: Headers): string | null {
  return headers.get('x-csrf-token') || null;
}

export const csrfProtection = {
  validateToken: validateCSRFToken,
  generateToken: generateCSRFToken,
};
