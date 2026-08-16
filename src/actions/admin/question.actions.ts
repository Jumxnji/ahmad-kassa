"use server";

import { revalidatePath } from "next/cache";
import { fieldErrorsFromZod, runAction } from "@/lib/action-helpers";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { requirePermission } from "@/permissions/require-permission";
import { questionService } from "@/services/question.service";
import { addInternalNoteSchema, updateQuestionSchema } from "@/validators/question.validator";

export async function updateQuestionAction(id: string, values: unknown) {
  return runAction(async () => {
    await requirePermission("questions", "update");

    const parsed = updateQuestionSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the form and try again.", fieldErrorsFromZod(parsed.error));
    }

    const existing = await questionService.get(id);
    if (!existing) throw new NotFoundError("Question");

    const question = await questionService.update(id, parsed.data);
    revalidatePath("/admin/ask-ahmad");
    revalidatePath(`/admin/ask-ahmad/${id}`);
    return question;
  }, "Question updated.");
}

export async function archiveQuestionAction(id: string) {
  return runAction(async () => {
    await requirePermission("questions", "update");
    const existing = await questionService.get(id);
    if (!existing) throw new NotFoundError("Question");

    const question = await questionService.update(id, { status: "ARCHIVED" });
    revalidatePath("/admin/ask-ahmad");
    revalidatePath(`/admin/ask-ahmad/${id}`);
    return question;
  }, "Question archived.");
}

export async function markQuestionReadAction(id: string) {
  return runAction(async () => {
    await requirePermission("questions", "update");
    const existing = await questionService.get(id);
    if (!existing) throw new NotFoundError("Question");

    const question = await questionService.markRead(id);
    revalidatePath("/admin/ask-ahmad");
    return question;
  }, "Marked as read.");
}

export async function markQuestionUnreadAction(id: string) {
  return runAction(async () => {
    await requirePermission("questions", "update");
    const question = await questionService.markUnread(id);
    revalidatePath("/admin/ask-ahmad");
    revalidatePath(`/admin/ask-ahmad/${id}`);
    return question;
  }, "Marked as unread.");
}

export async function addInternalNoteAction(questionId: string, values: unknown) {
  return runAction(async () => {
    const user = await requirePermission("questions", "update");

    const parsed = addInternalNoteSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Write a note first.", fieldErrorsFromZod(parsed.error));
    }

    const existing = await questionService.get(questionId);
    if (!existing) throw new NotFoundError("Question");

    const note = await questionService.addInternalNote(questionId, user.id, parsed.data);
    revalidatePath(`/admin/ask-ahmad/${questionId}`);
    return note;
  }, "Note added.");
}

export async function deleteQuestionAction(id: string) {
  return runAction(async () => {
    await requirePermission("questions", "delete");
    const existing = await questionService.get(id);
    if (!existing) throw new NotFoundError("Question");

    await questionService.remove(id);
    revalidatePath("/admin/ask-ahmad");
    return { id };
  }, "Question deleted.");
}

export async function toggleQuestionFlagAction(id: string, flagged: boolean) {
  return runAction(async () => {
    await requirePermission("questions", "update");
    const question = await questionService.setFlagged(id, flagged);
    revalidatePath("/admin/ask-ahmad");
    revalidatePath(`/admin/ask-ahmad/${id}`);
    return question;
  }, flagged ? "Question flagged." : "Flag removed.");
}
