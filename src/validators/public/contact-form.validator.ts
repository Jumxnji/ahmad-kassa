import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Enter a valid email address."),
  reason: z.enum(
    ["speaking", "seminars", "general", "books", "media"],
    { error: "Choose the reason for your enquiry." }
  ),
  message: z
    .string()
    .trim()
    .min(20, "Say a little more — at least 20 characters.")
    .max(2000, "Keep your message under 2000 characters."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
