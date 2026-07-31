import { z } from "zod";

export const CONTACT_REASONS = ["SPEAKING", "SEMINARS", "GENERAL", "BOOKS", "MEDIA"] as const;
export const CONTACT_STATUSES = ["NEW", "READ", "ARCHIVED"] as const;

export const contactMessageSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email(),
  reason: z.enum(CONTACT_REASONS),
  message: z.string().min(10).max(2000),
  status: z.enum(CONTACT_STATUSES),
});
