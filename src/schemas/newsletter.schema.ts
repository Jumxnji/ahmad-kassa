import { z } from "zod";

export const newsletterSubscriberSchema = z.object({
  email: z.email(),
  language: z.string().min(2).max(10),
  subscribed: z.boolean(),
});
