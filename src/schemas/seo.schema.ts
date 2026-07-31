import { z } from "zod";

/**
 * Reusable SEO shape — embedded (as a nested optional object) into
 * any content schema that needs meta/OG/Twitter fields, rather than
 * repeating these fields on every model.
 */
export const seoSchema = z.object({
  metaTitle: z.string().max(70, "Keep meta titles under 70 characters.").optional(),
  metaDescription: z.string().max(160, "Keep meta descriptions under 160 characters.").optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImageId: z.string().uuid().optional().nullable(),
  twitterCard: z.string().optional(),
  twitterImageId: z.string().uuid().optional().nullable(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  keywords: z.string().max(300).optional(),
  noindex: z.boolean().optional(),
});

export type SeoInput = z.infer<typeof seoSchema>;
