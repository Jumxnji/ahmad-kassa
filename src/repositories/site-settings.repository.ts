import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

const SITE_SETTINGS_ID = "site";

/**
 * The singleton row is guaranteed to exist after `prisma db seed` —
 * this is a plain update, not an upsert, so partial patches (e.g.
 * just `defaultSeoId`) don't need to satisfy the full create shape.
 */
export const siteSettingsRepository = {
  get() {
    return db.siteSettings.findUnique({
      where: { id: SITE_SETTINGS_ID },
      include: {
        logo: true,
        defaultSeo: { include: { ogImage: true, twitterImage: true } },
      },
    });
  },

  update(data: Prisma.SiteSettingsUncheckedUpdateInput) {
    return db.siteSettings.update({ where: { id: SITE_SETTINGS_ID }, data });
  },
};
