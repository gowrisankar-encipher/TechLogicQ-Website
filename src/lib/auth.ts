/**
 * Admin session tokens: HMAC-signed cookies keyed by ADMIN_SESSION_SECRET.
 * (Credential checks live in admin-account.ts, which needs Node and MongoDB.)
 * Uses Web Crypto so it runs in both middleware (edge) and server actions (node).
 */
export const SESSION_COOKIE = "tlq_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

const encoder = new TextEncoder();

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

export function isSessionSecretConfigured() {
  return Boolean(getSecret());
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

/** Constant-time string comparison (compares fixed-length digests). */
export async function safeEqual(a: string, b: string) {
  const [da, db] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const x = new Uint8Array(da);
  const y = new Uint8Array(db);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export async function createSessionToken() {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured (min 32 characters).");
  const expires = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `admin.${expires}`;
  return `${payload}.${await hmac(payload, secret)}`;
}

export async function verifySessionToken(token: string | undefined) {
  const secret = getSecret();
  if (!token || !secret) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);
  const [role, expires] = payload.split(".");
  if (role !== "admin" || !Number.isFinite(Number(expires)) || Number(expires) < Date.now()) return false;
  return safeEqual(signature, await hmac(payload, secret));
}
