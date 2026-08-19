import type { SocialLink } from "@/types/site";

/**
 * Environment-aware — prefers NEXT_PUBLIC_SITE_URL (e.g. a preview
 * deployment or a not-yet-connected production domain) and falls back
 * to the real domain otherwise. Every canonical/OG/sitemap/robots
 * consumer reads through `siteConfig.url`, which is sourced from this
 * constant, so setting the env var once fixes all of them. Mirrors
 * the same pattern already established in src/lib/newsletter-urls.ts.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ahmadkassa.com";

export const SITE_NAME = "Ahmad Mohamed Kassa";

export const SITE_SHORT_NAME = "Ahmad Kassa";

export const SITE_TAGLINE = "Islamic scholarship for the modern seeker";

export const SITE_DESCRIPTION =
  "Books, courses, and writing from Ahmad Mohamed Kassa — an Islamic teacher, author, and speaker dedicated to grounded, accessible scholarship.";

export const CONTACT_EMAIL = "hello@ahmadkassa.com";

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { platform: "youtube", label: "YouTube", href: "https://youtube.com" },
  { platform: "instagram", label: "Instagram", href: "https://instagram.com" },
  { platform: "tiktok", label: "TikTok", href: "https://tiktok.com" },
] as const;

/**
 * `SOCIAL_LINKS` still holds generic placeholder domains, not real
 * profile URLs (see docs/PROJECT_MEMORY.md) — a bare platform
 * homepage has a `/` pathname, a real profile doesn't. Used so
 * nothing ever presents a placeholder as an active social profile
 * (structured data's `sameAs`, the public footer's social row) —
 * update to real URLs here and every consumer picks them up.
 */
export function hasConfirmedProfile(link: SocialLink): boolean {
  try {
    return new URL(link.href).pathname.length > 1;
  } catch {
    return false;
  }
}
