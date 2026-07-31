import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

export const mediaRepository = {
  findMany(args?: Prisma.MediaFindManyArgs) {
    return db.media.findMany({ orderBy: { createdAt: "desc" }, ...args });
  },

  findById(id: string) {
    return db.media.findUnique({ where: { id } });
  },

  count(where?: Prisma.MediaWhereInput) {
    return db.media.count({ where });
  },

  create(data: Prisma.MediaUncheckedCreateInput) {
    return db.media.create({ data });
  },

  update(id: string, data: Prisma.MediaUncheckedUpdateInput) {
    return db.media.update({ where: { id }, data });
  },

  delete(id: string) {
    return db.media.delete({ where: { id } });
  },
};
