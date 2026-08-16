import "server-only";
import { db } from "@/db/client";
import { DUPLICATE_SUBMISSION_WINDOW_MS } from "@/lib/spam-protection";
import type { Prisma } from "@/generated/prisma/client";

const WITH_DETAIL = {
  assignedTo: { select: { id: true, name: true } },
  conversation: {
    include: { messages: { orderBy: { createdAt: "asc" as const }, include: { senderUser: { select: { id: true, name: true } } } } },
  },
  notes: { orderBy: { createdAt: "desc" as const }, include: { author: { select: { id: true, name: true } } } },
} satisfies Prisma.QuestionInclude;

export const questionRepository = {
  findMany(args?: Prisma.QuestionFindManyArgs) {
    return db.question.findMany({ orderBy: { createdAt: "desc" }, ...args });
  },

  findById(id: string) {
    return db.question.findUnique({ where: { id } });
  },

  /** Everything the conversation detail page needs in one query: messages, internal notes, assignee. */
  findByIdWithDetail(id: string) {
    return db.question.findUnique({ where: { id }, include: WITH_DETAIL });
  },

  count(where?: Prisma.QuestionWhereInput) {
    return db.question.count({ where });
  },

  /** An identical-looking submission (same email + text) in the last couple of minutes — treated as a double-submit, not a new question. */
  findRecentDuplicate(email: string, initialMessage: string) {
    return db.question.findFirst({
      where: {
        email,
        initialMessage,
        createdAt: { gte: new Date(Date.now() - DUPLICATE_SUBMISSION_WINDOW_MS) },
      },
    });
  },

  /**
   * Creates the Question together with its Conversation + first USER
   * Message in one transaction — a question can never exist without a
   * conversation to hold future replies.
   */
  createWithConversation(data: {
    referenceNumber: string;
    name: string;
    email: string;
    category: Prisma.QuestionUncheckedCreateInput["category"];
    subject?: string | null;
    initialMessage: string;
    isPrivate: boolean;
  }) {
    return db.question.create({
      data: {
        ...data,
        status: "NEW",
        priority: "NORMAL",
        conversation: {
          create: {
            messages: { create: { senderType: "USER", message: data.initialMessage } },
          },
        },
        notifications: { create: { emailSent: false } },
      },
      include: WITH_DETAIL,
    });
  },

  update(id: string, data: Prisma.QuestionUncheckedUpdateInput) {
    return db.question.update({ where: { id }, data });
  },

  markRead(id: string) {
    return db.question.update({ where: { id }, data: { readAt: new Date() } });
  },

  markUnread(id: string) {
    return db.question.update({ where: { id }, data: { readAt: null } });
  },

  markNotificationSent(questionId: string) {
    return db.userNotification.updateMany({ where: { questionId }, data: { emailSent: true } });
  },

  addInternalNote(questionId: string, authorId: string | undefined, note: string) {
    return db.internalNote.create({
      data: { questionId, authorId, note },
      include: { author: { select: { id: true, name: true } } },
    });
  },

  delete(id: string) {
    return db.question.delete({ where: { id } });
  },
};
