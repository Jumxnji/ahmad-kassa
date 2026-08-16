import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Enter a valid email address."),
  reason: z.enum(
    ["speaking", "seminars", "general", "books", "media"],
    { error: "Choose the reason for your enquiry." }
  ),
  subject: z.string().trim().min(2, "Add a short subject.").max(150, "Keep the subject under 150 characters."),
  message: z
    .string()
    .trim()
    .min(20, "Say a little more — at least 20 characters.")
    .max(2000, "Keep your message under 2000 characters."),
  // Honeypot — see ask-form.validator.ts for why this isn't validated here.
  company: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
