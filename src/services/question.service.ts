import "server-only";
import { questionRepository } from "@/repositories/question.repository";
import type { $Enums, Prisma } from "@/generated/prisma/client";
import type { ParsedListQuery } from "@/lib/list-query";
import type { AskFormValues } from "@/validators/public/ask-form.validator";
import type { UpdateQuestionInput } from "@/validators/question.validator";

const SORTABLE_FIELDS = new Set(["name", "category", "status", "createdAt"]);

/** Public form values use lowercase-hyphenated topics; the DB enum is UPPER_SNAKE. */
const CATEGORY_MAP: Record<AskFormValues["topic"], $Enums.QuestionCategory> = {
  marriage: "MARRIAGE",
  family: "FAMILY",
  aqeedah: "AQEEDAH",
  fiqh: "FIQH",
  ruqyah: "RUQYAH",
  "mental-health": "MENTAL_HEALTH",
  other: "OTHER",
};

export const questionService = {
  list: (opts?: { status?: "PENDING" | "ANSWERED" | "ARCHIVED" }) =>
    questionRepository.findMany(opts?.status ? { where: { status: opts.status } } : undefined),

  get: (id: string) => questionRepository.findById(id),

  count: () => questionRepository.count(),
  countPending: () => questionRepository.count({ status: "PENDING" }),

  async listPaged(query: ParsedListQuery) {
    const where: Prisma.QuestionWhereInput = query.q
      ? {
          OR: [
            { name: { contains: query.q, mode: "insensitive" } },
            { email: { contains: query.q, mode: "insensitive" } },
            { question: { contains: query.q, mode: "insensitive" } },
          ],
        }
      : {};
    const orderBy: Prisma.QuestionOrderByWithRelationInput = {
      [SORTABLE_FIELDS.has(query.sort) ? query.sort : "createdAt"]: query.dir,
    };

    const [rows, total] = await Promise.all([
      questionRepository.findMany({ where, orderBy, skip: query.skip, take: query.take }),
      questionRepository.count(where),
    ]);

    return { rows, total };
  },

  /** Called from the public Ask Ahmad form. */
  submit: (input: AskFormValues) =>
    questionRepository.create({
      name: input.name,
      email: input.email,
      category: CATEGORY_MAP[input.topic],
      question: input.question,
      isPrivate: false,
      status: "PENDING",
    }),

  async update(id: string, input: UpdateQuestionInput) {
    const answeredAt = input.status === "ANSWERED" ? new Date() : undefined;
    return questionRepository.update(id, { ...input, ...(answeredAt ? { answeredAt } : {}) });
  },

  remove: (id: string) => questionRepository.delete(id),

  setFlagged: (id: string, flagged: boolean) => questionRepository.update(id, { flagged }),
};
