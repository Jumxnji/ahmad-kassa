"use server";

import { revalidatePath } from "next/cache";
import { fieldErrorsFromZod, runAction } from "@/lib/action-helpers";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { requirePermission } from "@/permissions/require-permission";
import { questionService } from "@/services/question.service";
import { updateQuestionSchema } from "@/validators/question.validator";

export async function updateQuestionAction(id: string, values: unknown) {
  return runAction(async () => {
    await requirePermission("questions", "update");

    const parsed = updateQuestionSchema.safeParse(values);
    if (!parsed.success) {
      throw new ValidationError("Please check the reply and try again.", fieldErrorsFromZod(parsed.error));
    }

    const existing = await questionService.get(id);
    if (!existing) throw new NotFoundError("Question");

    const question = await questionService.update(id, parsed.data);
    revalidatePath("/admin/ask-ahmad");
    return question;
  }, "Question updated.");
}

export async function deleteQuestionAction(id: string) {
  return runAction(async () => {
    await requirePermission("questions", "delete");
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
    return question;
  }, flagged ? "Question flagged." : "Flag removed.");
}
