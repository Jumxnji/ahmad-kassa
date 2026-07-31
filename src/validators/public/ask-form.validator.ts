import { z } from "zod";

export const askFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Enter a valid email address."),
  topic: z.enum(
    ["marriage", "family", "aqeedah", "fiqh", "ruqyah", "mental-health", "other"],
    { error: "Choose a category." }
  ),
  question: z
    .string()
    .trim()
    .min(20, "Add a bit more detail — at least 20 characters.")
    .max(2000, "Keep your question under 2000 characters."),
});

export type AskFormValues = z.infer<typeof askFormSchema>;
