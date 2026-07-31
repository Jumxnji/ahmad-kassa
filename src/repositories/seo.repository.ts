import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Seo rows are always owned 1:1 by another record (Book, Homepage,
 * About, SiteSettings) — there's no standalone "list all SEO" screen.
 * Callers create/update through the owning entity's service.
 */
export const seoRepository = {
  findById(id: string) {
    return db.seo.findUnique({ where: { id } });
  },

  create(data: Prisma.SeoUncheckedCreateInput) {
    return db.seo.create({ data });
  },

  update(id: string, data: Prisma.SeoUncheckedUpdateInput) {
    return db.seo.update({ where: { id }, data });
  },

  upsert(id: string | null | undefined, data: Prisma.SeoUncheckedCreateInput) {
    if (!id) return db.seo.create({ data });
    return db.seo.update({ where: { id }, data });
  },
};
