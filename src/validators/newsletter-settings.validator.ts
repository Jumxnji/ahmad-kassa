import { z } from "zod";

export const updateNewsletterSettingsSchema = z.object({
  senderName: z.string().trim().min(1, "Enter a sender name.").max(100),
  senderEmail: z.email("Enter a valid email address."),
  replyToEmail: z.email("Enter a valid email address.").optional().or(z.literal("")),
  confirmationSubject: z.string().trim().min(1, "Enter a subject line.").max(150),
  welcomeSubject: z.string().trim().min(1, "Enter a subject line.").max(150),
  defaultFooterText: z.string().trim().max(500).optional(),
  businessAddress: z.string().trim().max(300).optional(),
  defaultLanguage: z.string().min(2).max(10),
  confirmationTokenExpiryHours: z.coerce.number().int().min(1).max(24 * 14),
  testEmailAllowlist: z.array(z.email()).max(20),
});
export type UpdateNewsletterSettingsInput = z.infer<typeof updateNewsletterSettingsSchema>;
