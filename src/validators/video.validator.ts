import { z } from "zod";
import { videoSchema } from "@/schemas/video.schema";

export const createVideoSchema = videoSchema.omit({ id: true }).extend({
  slug: z.string().min(2).max(200).optional(),
});
export type CreateVideoInput = z.infer<typeof createVideoSchema>;

export const updateVideoSchema = createVideoSchema.partial();
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
