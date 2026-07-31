"use server";

import { revalidatePath } from "next/cache";
import { fieldErrorsFromZod, runAction } from "@/lib/action-helpers";
import { ValidationError } from "@/lib/errors";
import { requirePermission } from "@/permissions/require-permission";
import { seoSchema } from "@/schemas/seo.schema";
import { seoService } from "@/services/seo.service";
import { siteSettingsService } from "@/services/site-settings.service";

/** Site-wide default SEO — the fallback used when a page doesn't set its own. */
export async function updateDefaultSeoAction(values: unknown) {
  return runAction(async () => {
    await requirePermission("seo", "update");

    const parsed = seoSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the form and try again.", fieldErrorsFromZod(parsed.error));
    }

    const settings = await siteSettingsService.get();
    const seoRow = await seoService.save(settings?.defaultSeoId ?? null, parsed.data);
    await siteSettingsService.update({ defaultSeoId: seoRow.id });

    revalidatePath("/admin/seo");
    revalidatePath("/", "layout");
    revalidatePath("/robots.txt");
    return seoRow;
  }, "Default SEO updated.");
}
