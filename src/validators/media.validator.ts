import { z } from "zod";
import { mediaUploadSchema } from "@/schemas/media.schema";

export const uploadMediaSchema = mediaUploadSchema;
export type UploadMediaInput = z.infer<typeof uploadMediaSchema>;

export const renameMediaSchema = z.object({
  filename: z.string().min(1).max(255),
});
export type RenameMediaInput = z.infer<typeof renameMediaSchema>;

export const updateMediaDetailsSchema = z.object({
  filename: z.string().min(1).max(255),
  altText: z.string().max(300).optional().or(z.literal("")),
});
export type UpdateMediaDetailsInput = z.infer<typeof updateMediaDetailsSchema>;
