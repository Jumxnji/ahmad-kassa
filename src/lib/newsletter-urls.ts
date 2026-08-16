import { siteConfig } from "@/config/site";
import { unsubscribeToken } from "@/lib/newsletter-token";

// Plain helpers, deliberately not in an actions file — every top-level
// export of a "use server" module must itself be an async Server
// Action, which these aren't.

/** Prefers NEXT_PUBLIC_SITE_URL (e.g. a preview deployment URL) — falls back to the hardcoded siteConfig.url otherwise. */
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;

export function confirmUrl(rawToken: string): string {
  return new URL(`/newsletter/confirm?token=${rawToken}`, BASE_URL).toString();
}

/** Reconstructible at any time from just the subscriber id — see unsubscribeToken()'s doc comment. */
export function unsubscribeUrl(subscriberId: string): string {
  const token = unsubscribeToken(subscriberId);
  return new URL(`/newsletter/unsubscribe?sid=${subscriberId}&token=${token}`, BASE_URL).toString();
}
