import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

const HOMEPAGE_ID = "homepage";

/**
 * The singleton row is guaranteed to exist after `prisma db seed` — a
 * plain update, not an upsert, so Prisma doesn't have to guess between
 * checked/unchecked input shapes across a combined create+update call
 * (the same class of bug fixed on SiteSettings — see that repository).
 */
export const homepageRepository = {
  get() {
    return db.homepageContent.findUnique({
      where: { id: HOMEPAGE_ID },
      include: { heroImage: true, featuredBook: true, seo: true },
    });
  },

  update(data: Prisma.HomepageContentUncheckedUpdateInput) {
    return db.homepageContent.update({
      where: { id: HOMEPAGE_ID },
      data,
      include: { heroImage: true, featuredBook: true, seo: true },
    });
  },
};
