import { z } from "zod";
import { QUESTION_STATUSES } from "@/schemas/question.schema";

export const updateQuestionSchema = z.object({
  status: z.enum(QUESTION_STATUSES),
  answer: z.string().max(4000).optional(),
  isPrivate: z.boolean().optional(),
});
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
