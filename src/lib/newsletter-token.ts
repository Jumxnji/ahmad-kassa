import { randomBytes, createHash, createHmac, timingSafeEqual } from "node:crypto";

// No `server-only` guard — prisma/seed.ts and the migration backfill
// script both import this directly via tsx, outside the Next.js
// bundler (same reasoning as src/lib/password.ts).

const PEPPER = process.env.NEWSLETTER_TOKEN_SECRET ?? "";

if (!PEPPER && process.env.NODE_ENV === "production") {
  console.error("[newsletter-token] NEWSLETTER_TOKEN_SECRET is not set — token hashes are unpeppered.");
}

/**
 * Confirmation tokens are single-use and must expire, so they're
 * generated randomly and only their hash is ever persisted (with
 * confirmationTokenExpiresAt tracking validity) — a fast, peppered
 * SHA-256 is the right tool here since these are already
 * high-entropy random values, not user-chosen secrets.
 */
export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(`${token}${PEPPER}`).digest("hex");
}

/**
 * Unsubscribe links, by contrast, must keep working indefinitely and
 * be embeddable in *every* future email without the app ever having
 * stored a raw value to look up — so instead of a random token +
 * stored hash, this is deterministic: HMAC-SHA256(subscriberId),
 * recomputed and compared on click. Nothing about it is persisted;
 * it's valid for a subscriber's whole lifetime and needs no migration
 * backfill for existing rows.
 */
export function unsubscribeToken(subscriberId: string): string {
  return createHmac("sha256", PEPPER).update(subscriberId).digest("hex");
}

export function isTokenExpired(expiresAt: Date | null, now: Date = new Date()): boolean {
  return expiresAt !== null && expiresAt < now;
}

export function verifyUnsubscribeToken(subscriberId: string, token: string): boolean {
  const expected = Buffer.from(unsubscribeToken(subscriberId), "hex");
  let provided: Buffer;
  try {
    provided = Buffer.from(token, "hex");
  } catch {
    return false;
  }
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}
