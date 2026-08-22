"use server";

import { revalidatePath } from "next/cache";
import { fieldErrorsFromZod, runAction } from "@/lib/action-helpers";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { requirePermission } from "@/permissions/require-permission";
import { videoService } from "@/services/video.service";
import { createVideoSchema, updateVideoSchema } from "@/validators/video.validator";

function revalidateVideos() {
  revalidatePath("/admin/videos");
  revalidatePath("/admin/homepage");
  revalidatePath("/");
}

export async function createVideoAction(values: unknown) {
  return runAction(async () => {
    await requirePermission("content", "create");

    const parsed = createVideoSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the form and try again.", fieldErrorsFromZod(parsed.error));
    }

    const video = await videoService.create(parsed.data);
    revalidateVideos();
    return video;
  }, "Video created.");
}

export async function updateVideoAction(id: string, values: unknown) {
  return runAction(async () => {
    await requirePermission("content", "update");

    const parsed = updateVideoSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the form and try again.", fieldErrorsFromZod(parsed.error));
    }

    const existing = await videoService.get(id);
    if (!existing) throw new NotFoundError("Video");

    const video = await videoService.update(id, parsed.data);
    revalidateVideos();
    return video;
  }, "Video updated.");
}

export async function deleteVideoAction(id: string) {
  return runAction(async () => {
    await requirePermission("content", "delete");

    const existing = await videoService.get(id);
    if (!existing) throw new NotFoundError("Video");

    await videoService.remove(id);
    revalidateVideos();
    return { id };
  }, "Video deleted.");
}

export async function setVideoStatusAction(id: string, status: "DRAFT" | "PUBLISHED") {
  return runAction(async () => {
    await requirePermission("content", "update");

    const existing = await videoService.get(id);
    if (!existing) throw new NotFoundError("Video");

    const video = await videoService.setStatus(id, status);
    revalidateVideos();
    return video;
  }, status === "PUBLISHED" ? "Video published." : "Video moved to draft.");
}
