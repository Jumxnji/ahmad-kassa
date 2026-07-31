import {
  CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_TAGLINE,
  SITE_URL,
  SOCIAL_LINKS,
} from "@/constants/site";
import type { SiteConfig } from "@/types/site";

export const siteConfig: SiteConfig = {
  name: SITE_NAME,
  shortName: SITE_SHORT_NAME,
  tagline: SITE_TAGLINE,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  ogImage: "/brand/og-image.png",
  twitterImage: "/brand/twitter-card.png",
  contactEmail: CONTACT_EMAIL,
  socialLinks: SOCIAL_LINKS,
};
