import { z } from "zod";
import { QUESTION_STATUSES, QUESTION_PRIORITIES } from "@/schemas/question.schema";

export const updateQuestionSchema = z.object({
  status: z.enum(QUESTION_STATUSES).optional(),
  priority: z.enum(QUESTION_PRIORITIES).optional(),
  isPrivate: z.boolean().optional(),
});
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;

export const addInternalNoteSchema = z.object({
  note: z.string().trim().min(1, "Write a note first.").max(4000),
});
export type AddInternalNoteInput = z.infer<typeof addInternalNoteSchema>;
