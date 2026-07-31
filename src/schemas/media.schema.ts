import { z } from "zod";

export const MEDIA_FOLDERS = [
  "IMAGES",
  "BOOK_COVERS",
  "GALLERY",
  "DOCUMENTS",
  "DOWNLOADS",
  "VIDEOS",
] as const;

export const mediaSchema = z.object({
  filename: z.string().min(1).max(255),
  url: z.string().min(1),
  thumbnailUrl: z.string().min(1).optional().nullable(),
  mimeType: z.string().min(1),
  size: z.number().int().positive(),
  folder: z.enum(MEDIA_FOLDERS),
  altText: z.string().max(300).optional().nullable(),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
});

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf",
];

export const mediaUploadSchema = z.object({
  folder: z.enum(MEDIA_FOLDERS),
  altText: z.string().max(300).optional(),
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0 && file.size <= MAX_UPLOAD_BYTES, {
      message: "Files must be under 15MB.",
    })
    .refine((file) => ACCEPTED_TYPES.includes(file.type), {
      message: "Unsupported file type — use JPG, PNG, WebP, GIF, SVG, or PDF.",
    }),
});
