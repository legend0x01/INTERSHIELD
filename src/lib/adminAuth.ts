import crypto from 'crypto';

// Admin session tokens are short-lived and signed with ADMIN_SECRET using
// HMAC-SHA256. There is NO hardcoded fallback: if ADMIN_SECRET is not set the
// admin area is treated as unconfigured and access is denied.

const TOKEN_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

export function getAdminSecret(): string | null {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.trim().length === 0) return null;
  return secret;
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function timingSafeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

// Issue a signed, expiring session token: "admin.<expiry>.<signature>".
export function issueAdminToken(secret: string): string {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `admin.${exp}`;
  return `${payload}.${sign(payload, secret)}`;
}

// Verify an Authorization header value (with or without the "Bearer " prefix).
export function verifyAdminToken(headerValue: string | null): boolean {
  const secret = getAdminSecret();
  if (!secret || !headerValue) return false;

  const raw = headerValue.replace(/^Bearer\s+/i, '').trim();
  const parts = raw.split('.');
  if (parts.length !== 3) return false;

  const [prefix, expStr, signature] = parts;
  if (prefix !== 'admin') return false;

  const payload = `${prefix}.${expStr}`;
  const expected = sign(payload, secret);
  if (!timingSafeEqual(signature, expected)) return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  return true;
}
