"use server";

import { revalidatePath } from "next/cache";
import { fieldErrorsFromZod, runAction } from "@/lib/action-helpers";
import { ValidationError } from "@/lib/errors";
import { requirePermission } from "@/permissions/require-permission";
import { homepageService } from "@/services/homepage.service";
import { homepageCredentialFormSchema, updateHomepageSchema } from "@/validators/homepage.validator";

function revalidateHomepage() {
  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

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
    revalidateHomepage();
    return homepage;
  }, "Homepage updated.");
}

export async function addHomepageCredentialAction(values: unknown) {
  return runAction(async () => {
    await requirePermission("content", "update");

    const parsed = homepageCredentialFormSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the entry and try again.", fieldErrorsFromZod(parsed.error));
    }

    const credential = await homepageService.addCredential(parsed.data);
    revalidateHomepage();
    return credential;
  }, "Credential added.");
}

export async function updateHomepageCredentialAction(id: string, values: unknown) {
  return runAction(async () => {
    await requirePermission("content", "update");

    const parsed = homepageCredentialFormSchema.partial().safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the entry and try again.", fieldErrorsFromZod(parsed.error));
    }

    const credential = await homepageService.updateCredential(id, parsed.data);
    revalidateHomepage();
    return credential;
  }, "Credential updated.");
}

export async function removeHomepageCredentialAction(id: string) {
  return runAction(async () => {
    await requirePermission("content", "update");
    await homepageService.removeCredential(id);
    revalidateHomepage();
    return { id };
  }, "Credential removed.");
}

export async function moveHomepageCredentialAction(id: string, direction: "up" | "down") {
  return runAction(async () => {
    await requirePermission("content", "update");
    await homepageService.moveCredential(id, direction);
    revalidateHomepage();
    return { id };
  }, "Credential reordered.");
}
