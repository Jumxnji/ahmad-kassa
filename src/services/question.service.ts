import "server-only";
import { questionRepository } from "@/repositories/question.repository";
import { referenceNumberService } from "@/services/reference-number.service";
import type { $Enums, Prisma } from "@/generated/prisma/client";
import type { ParsedListQuery } from "@/lib/list-query";
import type { AskFormValues } from "@/validators/public/ask-form.validator";
import type { AddInternalNoteInput, UpdateQuestionInput } from "@/validators/question.validator";

const SORTABLE_FIELDS = new Set(["name", "category", "status", "priority", "createdAt"]);

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
  list: (opts?: { status?: $Enums.QuestionStatus }) =>
    questionRepository.findMany(opts?.status ? { where: { status: opts.status } } : undefined),

  get: (id: string) => questionRepository.findById(id),
  getWithDetail: (id: string) => questionRepository.findByIdWithDetail(id),

  count: () => questionRepository.count(),
  countByStatus: (status: $Enums.QuestionStatus) => questionRepository.count({ status }),
  countUnread: () => questionRepository.count({ readAt: null }),

  async listPaged(
    query: ParsedListQuery,
    filters?: { status?: $Enums.QuestionStatus; category?: $Enums.QuestionCategory; unreadOnly?: boolean }
  ) {
    const where: Prisma.QuestionWhereInput = {
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" } },
              { email: { contains: query.q, mode: "insensitive" } },
              { subject: { contains: query.q, mode: "insensitive" } },
              { initialMessage: { contains: query.q, mode: "insensitive" } },
              { referenceNumber: { contains: query.q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.category ? { category: filters.category } : {}),
      ...(filters?.unreadOnly ? { readAt: null } : {}),
    };
    const orderBy: Prisma.QuestionOrderByWithRelationInput = {
      [SORTABLE_FIELDS.has(query.sort) ? query.sort : "createdAt"]: query.dir,
    };

    const [rows, total] = await Promise.all([
      questionRepository.findMany({ where, orderBy, skip: query.skip, take: query.take }),
      questionRepository.count(where),
    ]);

    return { rows, total };
  },

  /** Called from the public Ask Ahmad form — creates the Question, its Conversation, and the first USER Message together. */
  async submit(input: AskFormValues) {
    const referenceNumber = await referenceNumberService.next("question");
    return questionRepository.createWithConversation({
      referenceNumber,
      name: input.name,
      email: input.email,
      category: CATEGORY_MAP[input.topic],
      subject: input.subject || null,
      initialMessage: input.question,
      isPrivate: false,
    });
  },

  findRecentDuplicate: (email: string, initialMessage: string) =>
    questionRepository.findRecentDuplicate(email, initialMessage),

  update: (id: string, input: UpdateQuestionInput) => questionRepository.update(id, input),

  markRead: (id: string) => questionRepository.markRead(id),
  markUnread: (id: string) => questionRepository.markUnread(id),
  markNotificationSent: (questionId: string) => questionRepository.markNotificationSent(questionId),

  addInternalNote: (questionId: string, authorId: string | undefined, input: AddInternalNoteInput) =>
    questionRepository.addInternalNote(questionId, authorId, input.note),

  remove: (id: string) => questionRepository.delete(id),

  setFlagged: (id: string, flagged: boolean) => questionRepository.update(id, { flagged }),
};
