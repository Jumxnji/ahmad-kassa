import { z } from "zod";

export const videoStatusValues = ["DRAFT", "PUBLISHED"] as const;
export const videoStatusSchema = z.enum(videoStatusValues);
export type VideoStatusValue = z.infer<typeof videoStatusSchema>;

/** Canonical Video shape — mirrors the Prisma model field-for-field. */
export const videoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/, "Enter a valid YouTube URL or video ID."),
  thumbnailUrl: z.string().url(),
  publishedAt: z.coerce.date().optional().nullable(),
  durationMinutes: z.coerce.number().int().min(0).max(600).optional().nullable(),
  source: z.string().max(120).optional().or(z.literal("")).nullable(),
  category: z.string().max(60).optional().or(z.literal("")).nullable(),
  status: videoStatusSchema,
});
