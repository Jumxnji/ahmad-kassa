import { z } from "zod";
import { locales } from "@/config/i18n";

export const SUBSCRIBER_STATUSES = [
  "PENDING",
  "ACTIVE",
  "UNSUBSCRIBED",
  "SUPPRESSED",
  "BOUNCED",
  "COMPLAINED",
] as const;

export const SUBSCRIBER_SOURCES = [
  "HOMEPAGE",
  "FOOTER",
  "NEWSLETTER_PAGE",
  "BOOK_PAGE",
  "COURSES_COMING_SOON",
  "ADMIN_IMPORT",
  "OTHER",
] as const;

/** Statuses a campaign send (or admin "reactivate") is never allowed to move a subscriber into automatically. */
export const NEVER_AUTO_REACTIVATE_STATUSES = ["SUPPRESSED", "BOUNCED", "COMPLAINED"] as const;

/** The one predicate a campaign send may ever use to decide who receives it — mirrors newsletterRepository.findActiveForCampaign()'s `status: "ACTIVE"` filter. */
export function canReceiveCampaign(status: (typeof SUBSCRIBER_STATUSES)[number]): boolean {
  return status === "ACTIVE";
}

export const newsletterSubscriberSchema = z.object({
  email: z.email(),
  firstName: z.string().trim().max(80).optional().nullable(),
  preferredLanguage: z.enum(locales),
  status: z.enum(SUBSCRIBER_STATUSES),
  source: z.enum(SUBSCRIBER_SOURCES),
});
