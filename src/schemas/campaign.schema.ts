import { z } from "zod";

export const CAMPAIGN_STATUSES = [
  "DRAFT",
  "READY",
  "SCHEDULED",
  "SENDING",
  "SENT",
  "PARTIALLY_FAILED",
  "CANCELLED",
] as const;

/** Statuses a campaign is safe to edit or delete from — once sending has started it's an immutable historical record. */
export const EDITABLE_CAMPAIGN_STATUSES = ["DRAFT", "READY"] as const;

export const campaignContentSchema = z.object({
  internalName: z.string().trim().min(2, "Give this campaign an internal name.").max(150),
  title: z.string().trim().max(150),
  subject: z.string().trim().max(150),
  previewText: z.string().trim().max(150).optional(),
  content: z.string(),
  plainTextContent: z.string(),
  ctaLabel: z.string().trim().max(60).optional(),
  ctaUrl: z.url("Enter a valid URL.").optional().or(z.literal("")),
  secondaryContent: z.string().trim().max(2000).optional(),
  senderName: z.string().trim().max(100).optional(),
  replyToEmail: z.email("Enter a valid email address.").optional().or(z.literal("")),
  language: z.string().min(2).max(10),
});
export type CampaignContentInput = z.infer<typeof campaignContentSchema>;
