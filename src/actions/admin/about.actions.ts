"use server";

import { revalidatePath } from "next/cache";
import { fieldErrorsFromZod, runAction } from "@/lib/action-helpers";
import { ValidationError } from "@/lib/errors";
import { requirePermission } from "@/permissions/require-permission";
import { aboutService } from "@/services/about.service";
import {
  educationItemFormSchema,
  timelineItemFormSchema,
  updateAboutSchema,
} from "@/validators/about.validator";

function revalidateAbout() {
  revalidatePath("/admin/about");
  revalidatePath("/about");
}

export async function updateAboutAction(values: unknown) {
  return runAction(async () => {
    await requirePermission("content", "update");

    const parsed = updateAboutSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the form and try again.", fieldErrorsFromZod(parsed.error));
    }

    const about = await aboutService.update(parsed.data);
    revalidateAbout();
    return about;
  }, "About page updated.");
}

export async function addTimelineItemAction(values: unknown) {
  return runAction(async () => {
    await requirePermission("content", "update");

    const parsed = timelineItemFormSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the entry and try again.", fieldErrorsFromZod(parsed.error));
    }

    const item = await aboutService.addTimelineItem(parsed.data);
    revalidateAbout();
    return item;
  }, "Timeline entry added.");
}

export async function updateTimelineItemAction(id: string, values: unknown) {
  return runAction(async () => {
    await requirePermission("content", "update");

    const parsed = timelineItemFormSchema.partial().safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the entry and try again.", fieldErrorsFromZod(parsed.error));
    }

    const item = await aboutService.updateTimelineItem(id, parsed.data);
    revalidateAbout();
    return item;
  }, "Timeline entry updated.");
}

export async function removeTimelineItemAction(id: string) {
  return runAction(async () => {
    await requirePermission("content", "update");
    await aboutService.removeTimelineItem(id);
    revalidateAbout();
    return { id };
  }, "Timeline entry removed.");
}

export async function addEducationItemAction(values: unknown) {
  return runAction(async () => {
    await requirePermission("content", "update");

    const parsed = educationItemFormSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the entry and try again.", fieldErrorsFromZod(parsed.error));
    }

    const item = await aboutService.addEducationItem(parsed.data);
    revalidateAbout();
    return item;
  }, "Education entry added.");
}

export async function updateEducationItemAction(id: string, values: unknown) {
  return runAction(async () => {
    await requirePermission("content", "update");

    const parsed = educationItemFormSchema.partial().safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the entry and try again.", fieldErrorsFromZod(parsed.error));
    }

    const item = await aboutService.updateEducationItem(id, parsed.data);
    revalidateAbout();
    return item;
  }, "Education entry updated.");
}

export async function removeEducationItemAction(id: string) {
  return runAction(async () => {
    await requirePermission("content", "update");
    await aboutService.removeEducationItem(id);
    revalidateAbout();
    return { id };
  }, "Education entry removed.");
}
