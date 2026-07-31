import { z } from "zod";
import { seoSchema } from "@/schemas/seo.schema";

/** Canonical Book shape — mirrors the Prisma model field-for-field. */
export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  description: z.string().max(5000).optional().nullable(),
  excerpt: z.string().min(10).max(600),
  coverImageId: z.string().uuid().optional().nullable(),
  amazonUrl: z.string().url().optional().or(z.literal("")).nullable(),
  directPurchaseUrl: z.string().url().optional().or(z.literal("")).nullable(),
  published: z.boolean(),
  comingSoon: z.boolean(),
  featured: z.boolean(),
  seo: seoSchema.optional(),
});
