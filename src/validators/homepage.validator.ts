import type { z } from "zod";
import { homepageContentSchema } from "@/schemas/homepage.schema";

export const updateHomepageSchema = homepageContentSchema;
export type UpdateHomepageInput = z.infer<typeof updateHomepageSchema>;
