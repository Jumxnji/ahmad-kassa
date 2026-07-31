import type { z } from "zod";
import { siteSettingsSchema } from "@/schemas/site-settings.schema";

export const updateSiteSettingsSchema = siteSettingsSchema;
export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>;
