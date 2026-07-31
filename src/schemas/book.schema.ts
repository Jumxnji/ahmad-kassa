import { z } from "zod";
import { seoSchema } from "@/schemas/seo.schema";

export const bookStatusValues = ["DRAFT", "PUBLISHED", "COMING_SOON", "ARCHIVED"] as const;
export const bookStatusSchema = z.enum(bookStatusValues);
export type BookStatusValue = z.infer<typeof bookStatusSchema>;

/** Canonical Book shape — mirrors the Prisma model field-for-field. */
export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  description: z.string().max(20000).optional().nullable(),
  excerpt: z.string().min(10).max(600),
  authorName: z.string().min(2).max(200),
  publicationDate: z.coerce.date().optional().nullable(),
  isbn: z
    .string()
    .max(32)
    .optional()
    .or(z.literal(""))
    .nullable(),
  language: z.string().min(2).max(60),
  category: z.string().max(60).optional().or(z.literal("")).nullable(),
  tags: z.array(z.string().min(1).max(40)).max(20),
  coverImageId: z.string().uuid().optional().nullable(),
  galleryIds: z.array(z.string().uuid()).max(24),
  amazonUrl: z.string().url().optional().or(z.literal("")).nullable(),
  directPurchaseUrl: z.string().url().optional().or(z.literal("")).nullable(),
  signedCopyAvailable: z.boolean(),
  ebookUrl: z.string().url().optional().or(z.literal("")).nullable(),
  audiobookUrl: z.string().url().optional().or(z.literal("")).nullable(),
  status: bookStatusSchema,
  featured: z.boolean(),
  seo: seoSchema.optional(),
});
