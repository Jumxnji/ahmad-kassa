import { z } from "zod";
import { seoSchema } from "@/schemas/seo.schema";

export const CONTENT_STATUSES = ["DRAFT", "PUBLISHED"] as const;

/**
 * Note: `aboutPreviewText` (the legacy, orphaned field — see the
 * Prisma schema's own comment on it) is deliberately absent here.
 * Never read or write it from new code; the four `about*` fields below
 * replace it.
 */
export const homepageContentSchema = z
  .object({
    heroEyebrow: z.string().min(2).max(120),
    heroHeadline: z.string().min(2).max(120),
    heroSubtitle: z.string().min(2).max(400),
    heroPrimaryCtaLabel: z.string().min(1).max(40),
    heroPrimaryCtaHref: z.string().min(1).max(200),
    heroSecondaryCtaLabel: z.string().min(1).max(40),
    heroSecondaryCtaHref: z.string().min(1).max(200),
    heroImageId: z.string().uuid().optional().nullable(),
    aboutEyebrow: z.string().min(2).max(120),
    aboutSubtitle: z.string().min(2).max(120),
    aboutLede: z.string().min(10).max(400),
    aboutBody: z.string().min(10).max(2000),
    featuredBookId: z.string().uuid().optional().nullable(),
    primaryKhutbahId: z.string().uuid().optional().nullable(),
    supportingKhutbah1Id: z.string().uuid().optional().nullable(),
    supportingKhutbah2Id: z.string().uuid().optional().nullable(),
    newsletterHeadline: z.string().min(2).max(120),
    newsletterText: z.string().min(10).max(400),
    status: z.enum(CONTENT_STATUSES),
    seo: seoSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const slots = [
      { key: "primaryKhutbahId", value: data.primaryKhutbahId },
      { key: "supportingKhutbah1Id", value: data.supportingKhutbah1Id },
      { key: "supportingKhutbah2Id", value: data.supportingKhutbah2Id },
    ] as const;
    const chosen = slots.filter((slot) => slot.value);
    const seen = new Set<string>();
    for (const slot of chosen) {
      if (seen.has(slot.value as string)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Each khutbah can only be assigned to one slot.",
          path: [slot.key],
        });
      }
      seen.add(slot.value as string);
    }
  });

/** A single "who teaches here" credential line — normalized child row on `HomepageContent`, capped at 4 to match the section's tested vertical rhythm (see the Prisma schema's comment on `HomepageCredential`). */
export const homepageCredentialSchema = z.object({
  label: z.string().min(1).max(80),
  order: z.number().int().min(0),
});

export const MAX_HOMEPAGE_CREDENTIALS = 4;
