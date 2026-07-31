"use server";

import { revalidatePath } from "next/cache";
import { fieldErrorsFromZod, runAction } from "@/lib/action-helpers";
import { ValidationError } from "@/lib/errors";
import { requirePermission } from "@/permissions/require-permission";
import { homepageService } from "@/services/homepage.service";
import { updateHomepageSchema } from "@/validators/homepage.validator";

export async function updateHomepageAction(values: unknown) {
  return runAction(async () => {
    await requirePermission("content", "update");

    const parsed = updateHomepageSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError(
        "Please check the form and try again.",
        fieldErrorsFromZod(parsed.error)
      );
    }

    const homepage = await homepageService.update(parsed.data);
    revalidatePath("/admin/homepage");
    revalidatePath("/");
    return homepage;
  }, "Homepage updated.");
}
