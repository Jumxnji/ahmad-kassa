import "server-only";
import { db } from "@/db/client";
import { DUPLICATE_SUBMISSION_WINDOW_MS } from "@/lib/spam-protection";
import type { Prisma } from "@/generated/prisma/client";

export const contactRepository = {
  findMany(args?: Prisma.ContactMessageFindManyArgs) {
    return db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, ...args });
  },

  findById(id: string) {
    return db.contactMessage.findUnique({ where: { id } });
  },

  count(where?: Prisma.ContactMessageWhereInput) {
    return db.contactMessage.count({ where });
  },

  /** Same double-submit guard as questions — see question.repository.ts. */
  findRecentDuplicate(email: string, message: string) {
    return db.contactMessage.findFirst({
      where: { email, message, createdAt: { gte: new Date(Date.now() - DUPLICATE_SUBMISSION_WINDOW_MS) } },
    });
  },

  create(data: Prisma.ContactMessageUncheckedCreateInput) {
    return db.contactMessage.create({ data });
  },

  update(id: string, data: Prisma.ContactMessageUncheckedUpdateInput) {
    return db.contactMessage.update({ where: { id }, data });
  },

  delete(id: string) {
    return db.contactMessage.delete({ where: { id } });
  },
};
