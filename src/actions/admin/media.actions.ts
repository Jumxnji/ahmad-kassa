"use server";

import { revalidatePath } from "next/cache";
import { fieldErrorsFromZod, runAction } from "@/lib/action-helpers";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { requirePermission } from "@/permissions/require-permission";
import { mediaService } from "@/services/media.service";
import { uploadMediaSchema, renameMediaSchema } from "@/validators/media.validator";

export async function uploadMediaAction(formData: FormData) {
  return runAction(async () => {
    const user = await requirePermission("media", "create");

    const parsed = uploadMediaSchema.safeParse({
      file: formData.get("file"),
      folder: formData.get("folder"),
      altText: formData.get("altText") || undefined,
    });
    if (!parsed.success) {
      throw new ValidationError(
        "Please choose a valid file.",
        fieldErrorsFromZod(parsed.error)
      );
    }

    const buffer = Buffer.from(await parsed.data.file.arrayBuffer());

    const media = await mediaService.upload({
      buffer,
      filename: parsed.data.file.name,
      mimeType: parsed.data.file.type,
      folder: parsed.data.folder,
      altText: parsed.data.altText,
      uploadedById: user.id,
    });

    revalidatePath("/admin/media");
    return media;
  }, "File uploaded.");
}

export async function renameMediaAction(id: string, values: unknown) {
  return runAction(async () => {
    await requirePermission("media", "update");

    const parsed = renameMediaSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please enter a valid filename.", fieldErrorsFromZod(parsed.error));
    }

    const existing = await mediaService.get(id);
    if (!existing) throw new NotFoundError("File");

    const media = await mediaService.rename(id, parsed.data.filename);
    revalidatePath("/admin/media");
    return media;
  }, "File renamed.");
}

export async function deleteMediaAction(id: string) {
  return runAction(async () => {
    await requirePermission("media", "delete");

    const existing = await mediaService.get(id);
    if (!existing) throw new NotFoundError("File");

    await mediaService.remove(id);
    revalidatePath("/admin/media");
    return { id };
  }, "File deleted.");
}
