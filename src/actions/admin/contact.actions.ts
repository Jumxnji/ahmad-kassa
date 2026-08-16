"use server";

import { revalidatePath } from "next/cache";
import { fieldErrorsFromZod, runAction } from "@/lib/action-helpers";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { requirePermission } from "@/permissions/require-permission";
import { contactService } from "@/services/contact.service";
import { updateContactMessageSchema } from "@/validators/contact.validator";

export async function updateContactMessageAction(id: string, values: unknown) {
  return runAction(async () => {
    await requirePermission("contact", "update");

    const parsed = updateContactMessageSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please try again.", fieldErrorsFromZod(parsed.error));
    }

    const existing = await contactService.get(id);
    if (!existing) throw new NotFoundError("Message");

    const message = await contactService.update(id, parsed.data);
    revalidatePath("/admin/contact");
    return message;
  }, "Message updated.");
}

export async function deleteContactMessageAction(id: string) {
  return runAction(async () => {
    await requirePermission("contact", "delete");

    const existing = await contactService.get(id);
    if (!existing) throw new NotFoundError("Message");

    await contactService.remove(id);
    revalidatePath("/admin/contact");
    return { id };
  }, "Message deleted.");
}
