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
const FULL_INCLUDE = {
  heroImage: true,
  featuredBook: true,
  seo: true,
  primaryKhutbah: true,
  supportingKhutbah1: true,
  supportingKhutbah2: true,
  credentials: { orderBy: { order: "asc" as const } },
} satisfies Prisma.HomepageContentInclude;

export const homepageRepository = {
  get() {
    return db.homepageContent.findUnique({
      where: { id: HOMEPAGE_ID },
      include: FULL_INCLUDE,
    });
  },

  update(data: Prisma.HomepageContentUncheckedUpdateInput) {
    return db.homepageContent.update({
      where: { id: HOMEPAGE_ID },
      data,
      include: FULL_INCLUDE,
    });
  },

  // ---- Credentials ----
  createCredential(data: Omit<Prisma.HomepageCredentialUncheckedCreateInput, "homepageContentId">) {
    return db.homepageCredential.create({ data: { ...data, homepageContentId: HOMEPAGE_ID } });
  },

  updateCredential(id: string, data: Prisma.HomepageCredentialUncheckedUpdateInput) {
    return db.homepageCredential.update({ where: { id }, data });
  },

  deleteCredential(id: string) {
    return db.homepageCredential.delete({ where: { id } });
  },

  countCredentials() {
    return db.homepageCredential.count({ where: { homepageContentId: HOMEPAGE_ID } });
  },

  listCredentials() {
    return db.homepageCredential.findMany({
      where: { homepageContentId: HOMEPAGE_ID },
      orderBy: { order: "asc" },
    });
  },
};
