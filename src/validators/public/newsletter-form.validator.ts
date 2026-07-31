import { z } from "zod";

export const newsletterFormSchema = z.object({
  email: z.email("Enter a valid email address."),
});

export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;
