import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Pure data access — no validation, no permission checks, no business
 * rules. Services call these; nothing else should import `db` directly
 * for book data.
 */
type BookWithCoverAndSeo = Prisma.BookGetPayload<{ include: { coverImage: true; seo: true } }>;

export const bookRepository = {
  // Explicit return type: `include` below is always the same shape, but
  // spreading `...args` after it makes Prisma's own inference widen to
  // "maybe no include at all" unless the payload type is pinned here.
  findMany(args?: Prisma.BookFindManyArgs) {
    return db.book.findMany({
      orderBy: { createdAt: "desc" },
      include: { coverImage: true, seo: true },
      ...args,
    }) as Promise<BookWithCoverAndSeo[]>;
  },

  findById(id: string) {
    return db.book.findUnique({
      where: { id },
      include: { coverImage: true, gallery: true, seo: { include: { ogImage: true, twitterImage: true } } },
    });
  },

  findBySlug(slug: string) {
    return db.book.findUnique({
      where: { slug },
      include: { coverImage: true, gallery: true, seo: { include: { ogImage: true, twitterImage: true } } },
    });
  },

  /** Newest published book, excluding a given id — used for the homepage's "no featured book set" fallback. */
  findLatestPublished(excludeId?: string) {
    return db.book.findFirst({
      where: { status: "PUBLISHED", ...(excludeId ? { id: { not: excludeId } } : {}) },
      orderBy: { publicationDate: { sort: "desc", nulls: "last" } },
      include: { coverImage: true, seo: true },
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
