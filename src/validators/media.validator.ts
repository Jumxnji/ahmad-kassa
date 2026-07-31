import { z } from "zod";
import { mediaUploadSchema } from "@/schemas/media.schema";

export const uploadMediaSchema = mediaUploadSchema;
export type UploadMediaInput = z.infer<typeof uploadMediaSchema>;

export const renameMediaSchema = z.object({
  filename: z.string().min(1).max(255),
});
export type RenameMediaInput = z.infer<typeof renameMediaSchema>;
