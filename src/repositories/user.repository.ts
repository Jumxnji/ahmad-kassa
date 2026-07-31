import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

export const userRepository = {
  findMany(args?: Prisma.UserFindManyArgs) {
    return db.user.findMany({ orderBy: { createdAt: "asc" }, ...args });
  },

  findById(id: string) {
    return db.user.findUnique({ where: { id } });
  },

  findByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  },

  count(where?: Prisma.UserWhereInput) {
    return db.user.count({ where });
  },

  create(data: Prisma.UserUncheckedCreateInput) {
    return db.user.create({ data });
  },

  update(id: string, data: Prisma.UserUncheckedUpdateInput) {
    return db.user.update({ where: { id }, data });
  },

  delete(id: string) {
    return db.user.delete({ where: { id } });
  },
};
