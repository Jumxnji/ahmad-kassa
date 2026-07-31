import { z } from "zod";
import { CONTACT_STATUSES } from "@/schemas/contact.schema";

export const updateContactMessageSchema = z.object({
  status: z.enum(CONTACT_STATUSES),
});
export type UpdateContactMessageInput = z.infer<typeof updateContactMessageSchema>;
