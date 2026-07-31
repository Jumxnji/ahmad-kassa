import { z } from "zod";
import { seoSchema } from "@/schemas/seo.schema";

export const CONTENT_STATUSES = ["DRAFT", "PUBLISHED"] as const;

export const homepageContentSchema = z.object({
  heroEyebrow: z.string().min(2).max(120),
  heroHeadline: z.string().min(2).max(120),
  heroSubtitle: z.string().min(2).max(400),
  heroPrimaryCtaLabel: z.string().min(1).max(40),
  heroPrimaryCtaHref: z.string().min(1).max(200),
  heroSecondaryCtaLabel: z.string().min(1).max(40),
  heroSecondaryCtaHref: z.string().min(1).max(200),
  heroImageId: z.string().uuid().optional().nullable(),
  aboutPreviewText: z.string().min(10).max(1000),
  featuredBookId: z.string().uuid().optional().nullable(),
  newsletterHeadline: z.string().min(2).max(120),
  newsletterText: z.string().min(10).max(400),
  status: z.enum(CONTENT_STATUSES),
  seo: seoSchema.optional(),
});
