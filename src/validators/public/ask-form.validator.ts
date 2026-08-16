import { z } from "zod";

export const askFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Enter a valid email address."),
  topic: z.enum(
    ["marriage", "family", "aqeedah", "fiqh", "ruqyah", "mental-health", "other"],
    { error: "Choose a category." }
  ),
  subject: z.string().trim().max(150, "Keep the subject under 150 characters.").optional(),
  question: z
    .string()
    .trim()
    .min(20, "Add a bit more detail — at least 20 characters.")
    .max(2000, "Keep your question under 2000 characters."),
  consent: z.boolean().refine((value) => value === true, {
    message: "Please confirm before submitting.",
  }),
  // Honeypot — left blank by real visitors (hidden via CSS), never
  // validated here so an unexpected value never surfaces as a normal
  // form error to whatever filled it in.
  company: z.string().optional(),
});

export type AskFormValues = z.infer<typeof askFormSchema>;
