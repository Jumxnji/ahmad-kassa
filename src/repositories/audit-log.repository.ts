import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

export const auditLogRepository = {
  create(data: Prisma.AuditLogUncheckedCreateInput) {
    return db.auditLog.create({ data });
  },

  findMany(args?: Prisma.AuditLogFindManyArgs) {
    return db.auditLog.findMany({ orderBy: { createdAt: "desc" }, include: { user: true }, ...args });
  },

  count(where?: Prisma.AuditLogWhereInput) {
    return db.auditLog.count({ where });
  },
};
