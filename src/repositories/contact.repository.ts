import "server-only";
import { db } from "@/db/client";
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
