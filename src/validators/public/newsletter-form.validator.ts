import { z } from "zod";
import { SUBSCRIBER_SOURCES } from "@/schemas/newsletter.schema";

/** Bump this when the on-page consent copy in newsletter-form.tsx changes — every submission records the version shown at signup. */
export const NEWSLETTER_CONSENT_VERSION = "v1";

export const newsletterFormSchema = z.object({
  email: z.email("Enter a valid email address."),
  firstName: z.string().trim().max(80).optional(),
  // Honeypot — see ask-form.validator.ts for why this isn't validated here.
  company: z.string().optional(),
});

export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

/** What the Server Action actually receives — the form's fields plus the `source` prop each call site supplies. */
export const newsletterSubscribeSchema = newsletterFormSchema.extend({
  source: z.enum(SUBSCRIBER_SOURCES),
});
export type NewsletterSubscribeValues = z.infer<typeof newsletterSubscribeSchema>;
