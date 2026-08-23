import "server-only";
import { checkRateLimit, type RateLimitResult } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request-ip";

/** True if the hidden honeypot field was filled in — real visitors never see or fill it. */
export function isHoneypotTriggered(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Shared per-IP rate limit for public form submissions, keyed
 * separately per form so a flood on one doesn't lock out the other.
 * Backed by the same Upstash-based limiter as auth (see
 * src/lib/rate-limit.ts) — the IP never reaches Redis in the clear,
 * it's HMAC'd first.
 */
export async function checkFormRateLimit(formName: string): Promise<RateLimitResult> {
  const ip = await getRequestIp();
  return checkRateLimit(`form:${formName}:${ip ?? "unknown"}`);
}

/** How recently an identical-looking submission must have happened to be treated as a double-submit rather than a new one. */
export const DUPLICATE_SUBMISSION_WINDOW_MS = 2 * 60 * 1000;
