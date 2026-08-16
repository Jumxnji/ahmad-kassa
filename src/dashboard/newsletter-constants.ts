import type { $Enums } from "@/generated/prisma/client";

export const SUBSCRIBER_STATUS_LABEL: Record<$Enums.SubscriberStatus, string> = {
  PENDING: "Pending",
  ACTIVE: "Active",
  UNSUBSCRIBED: "Unsubscribed",
  SUPPRESSED: "Suppressed",
  BOUNCED: "Bounced",
  COMPLAINED: "Complained",
};

export const SUBSCRIBER_STATUS_TONE = {
  PENDING: "warning",
  ACTIVE: "success",
  UNSUBSCRIBED: "muted",
  SUPPRESSED: "muted",
  BOUNCED: "muted",
  COMPLAINED: "muted",
} as const;

export const SUBSCRIBER_SOURCE_LABEL: Record<$Enums.SubscriberSource, string> = {
  HOMEPAGE: "Homepage",
  FOOTER: "Footer",
  NEWSLETTER_PAGE: "Newsletter page",
  BOOK_PAGE: "Book page",
  COURSES_COMING_SOON: "Courses (coming soon)",
  ADMIN_IMPORT: "Admin import",
  OTHER: "Other",
};

export const CAMPAIGN_STATUS_LABEL: Record<$Enums.CampaignStatus, string> = {
  DRAFT: "Draft",
  READY: "Ready",
  SCHEDULED: "Scheduled",
  SENDING: "Sending",
  SENT: "Sent",
  PARTIALLY_FAILED: "Partially failed",
  CANCELLED: "Cancelled",
};

export const CAMPAIGN_STATUS_TONE = {
  DRAFT: "muted",
  READY: "neutral",
  SCHEDULED: "neutral",
  SENDING: "warning",
  SENT: "success",
  PARTIALLY_FAILED: "warning",
  CANCELLED: "muted",
} as const;
