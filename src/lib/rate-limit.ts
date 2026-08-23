import "server-only";
import { createHmac } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Shared, cross-instance rate limiting via Upstash Redis (Vercel
 * Marketplace integration — `KV_REST_API_URL`/`KV_REST_API_TOKEN` are
 * provisioned automatically, not something anyone sets by hand). This
 * replaces the previous in-memory `Map`, which didn't coordinate
 * across Vercel's multiple serverless instances — see git history for
 * that version. `checkRateLimit(key)`'s signature is unchanged from
 * before on purpose, so no call site needed to change beyond adding
 * `await`.
 *
 * Sliding window, 10 attempts / 15 minutes — identical numbers to the
 * previous in-memory limiter, just enforced correctly now.
 */
const WINDOW = "15 m";
const MAX_ATTEMPTS = 10;

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(MAX_ATTEMPTS, WINDOW),
  // Every caller already passes a namespaced key (e.g. "login:...",
  // "form:ask:...") — Upstash's own prefix would just double that up.
  prefix: "",
});

/**
 * Every caller-supplied key already carries the raw identifier being
 * limited (an email or an IP address) after its first `:` — e.g.
 * "login:ahmad@ahmadkassa.com". That full string is HMAC'd with
 * `AUTH_SECRET` (already a real secret in every environment; this
 * reuses it under a distinct, namespaced message rather than adding a
 * new env var just for this) before it ever reaches Redis, so no
 * email or IP is stored, even in hashed-but-guessable form — HMAC's
 * secret key makes it infeasible to enumerate. `bucket` (the part
 * before the first `:`) stays in the clear only for error logging —
 * it identifies which limiter tripped ("login", "form"), never who.
 */
function hashIdentifier(key: string): { bucket: string; hashed: string } {
  const bucket = key.split(":")[0] ?? "unknown";
  const secret = process.env.AUTH_SECRET ?? "";
  const hashed = createHmac("sha256", secret).update(`ratelimit:${key}`).digest("hex");
  return { bucket, hashed };
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

/**
 * Fails open: if Upstash is unreachable or errors, the request is
 * allowed through rather than blocking every login/form submission on
 * a third-party outage. The failure is logged server-side by bucket
 * only — never the original key, hashed or otherwise.
 */
export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  const { bucket, hashed } = hashIdentifier(key);

  try {
    const result = await ratelimit.limit(hashed);
    const retryAfterSeconds = result.success ? 0 : Math.max(0, Math.ceil((result.reset - Date.now()) / 1000));
    return { allowed: result.success, retryAfterSeconds };
  } catch (error) {
    console.error(`[rate-limit] Upstash unavailable for bucket "${bucket}" — failing open:`, error);
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

/** Called on successful login so a legitimate user isn't locked out by their own earlier typos. Best-effort — a failed reset just means the window runs its normal course. */
export async function resetRateLimit(key: string): Promise<void> {
  const { bucket, hashed } = hashIdentifier(key);
  try {
    await ratelimit.resetUsedTokens(hashed);
  } catch (error) {
    console.error(`[rate-limit] Upstash unavailable for bucket "${bucket}" — reset skipped:`, error);
  }
}
