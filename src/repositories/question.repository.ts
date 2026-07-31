import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

export const questionRepository = {
  findMany(args?: Prisma.QuestionFindManyArgs) {
    return db.question.findMany({ orderBy: { createdAt: "desc" }, ...args });
  },

  findById(id: string) {
    return db.question.findUnique({ where: { id } });
  },

  count(where?: Prisma.QuestionWhereInput) {
    return db.question.count({ where });
  },

  create(data: Prisma.QuestionUncheckedCreateInput) {
    return db.question.create({ data });
  },

  update(id: string, data: Prisma.QuestionUncheckedUpdateInput) {
    return db.question.update({ where: { id }, data });
  },

  delete(id: string) {
    return db.question.delete({ where: { id } });
  },
};
