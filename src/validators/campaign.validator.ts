import { z } from "zod";
import { campaignContentSchema } from "@/schemas/campaign.schema";

export const createCampaignSchema = z.object({
  internalName: z.string().trim().min(2, "Give this campaign an internal name.").max(150),
});
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;

export const updateCampaignSchema = campaignContentSchema.partial().extend({
  internalName: z.string().trim().min(2, "Give this campaign an internal name.").max(150),
});
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;

export const sendTestEmailSchema = z.object({
  emails: z
    .array(z.email("Enter valid email addresses."))
    .min(1, "Add at least one address.")
    .max(5, "Send to at most 5 test addresses at a time."),
});
export type SendTestEmailInput = z.infer<typeof sendTestEmailSchema>;
