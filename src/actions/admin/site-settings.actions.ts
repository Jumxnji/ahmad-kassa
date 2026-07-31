"use server";

import { revalidatePath } from "next/cache";
import { fieldErrorsFromZod, runAction } from "@/lib/action-helpers";
import { ValidationError } from "@/lib/errors";
import { requirePermission } from "@/permissions/require-permission";
import { siteSettingsService } from "@/services/site-settings.service";
import { updateSiteSettingsSchema } from "@/validators/site-settings.validator";

export async function updateSiteSettingsAction(values: unknown) {
  return runAction(async () => {
    await requirePermission("settings", "update");

    const parsed = updateSiteSettingsSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the form and try again.", fieldErrorsFromZod(parsed.error));
    }

    const settings = await siteSettingsService.update(parsed.data);
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return settings;
  }, "Site settings updated.");
}
