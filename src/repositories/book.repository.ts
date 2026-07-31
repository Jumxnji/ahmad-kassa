import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Pure data access — no validation, no permission checks, no business
 * rules. Services call these; nothing else should import `db` directly
 * for book data.
 */
export const bookRepository = {
  findMany(args?: Prisma.BookFindManyArgs) {
    return db.book.findMany({
      orderBy: { createdAt: "desc" },
      include: { coverImage: true, seo: true },
      ...args,
    });
  },

  findById(id: string) {
    return db.book.findUnique({
      where: { id },
      include: { coverImage: true, gallery: true, seo: true },
    });
  },

  findBySlug(slug: string) {
    return db.book.findUnique({
      where: { slug },
      include: { coverImage: true, gallery: true, seo: true },
    });
  },

  count(where?: Prisma.BookWhereInput) {
    return db.book.count({ where });
  },

  create(data: Prisma.BookUncheckedCreateInput) {
    return db.book.create({ data, include: { coverImage: true, seo: true } });
  },

  update(id: string, data: Prisma.BookUncheckedUpdateInput) {
    return db.book.update({ where: { id }, data, include: { coverImage: true, seo: true } });
  },

  delete(id: string) {
    return db.book.delete({ where: { id } });
  },
};
