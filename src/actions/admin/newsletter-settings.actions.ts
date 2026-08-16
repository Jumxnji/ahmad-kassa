"use server";

import { revalidatePath } from "next/cache";
import { runAction, fieldErrorsFromZod } from "@/lib/action-helpers";
import { ValidationError } from "@/lib/errors";
import { requirePermission } from "@/permissions/require-permission";
import { newsletterSettingsService } from "@/services/newsletter-settings.service";
import { updateNewsletterSettingsSchema } from "@/validators/newsletter-settings.validator";

export async function updateNewsletterSettingsAction(values: unknown) {
  return runAction(async () => {
    await requirePermission("newsletter", "update");

    const parsed = updateNewsletterSettingsSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the form and try again.", fieldErrorsFromZod(parsed.error));
    }

    const settings = await newsletterSettingsService.update({
      ...parsed.data,
      replyToEmail: parsed.data.replyToEmail || null,
      defaultFooterText: parsed.data.defaultFooterText || null,
      businessAddress: parsed.data.businessAddress || null,
    });

    revalidatePath("/admin/newsletter/settings");
    return settings;
  }, "Settings saved.");
}
