/**
 * In-memory, single-instance rate limiting — enough to slow down naive
 * credential-stuffing during development and on a single-process
 * deployment. This resets on every restart and does not coordinate
 * across multiple server instances.
 *
 * Production note: swap the `attempts` Map for a shared store (e.g.
 * Upstash Redis via `@upstash/ratelimit`) before running more than one
 * instance — the function signature (`checkRateLimit(key)`) is designed
 * to stay the same so that swap doesn't touch any call site.
 */
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10;

interface Attempt {
  count: number;
  windowStart: number;
}

const attempts = new Map<string, Attempt>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const existing = attempts.get(key);

  if (!existing || now - existing.windowStart > WINDOW_MS) {
    attempts.set(key, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;

  if (existing.count > MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - existing.windowStart)) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/** Called on successful login so a legitimate user isn't locked out by their own earlier typos. */
export function resetRateLimit(key: string): void {
  attempts.delete(key);
}
