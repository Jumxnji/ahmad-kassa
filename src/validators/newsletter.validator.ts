import { z } from "zod";

export const updateSubscriberSchema = z.object({
  subscribed: z.boolean(),
});
export type UpdateSubscriberInput = z.infer<typeof updateSubscriberSchema>;
