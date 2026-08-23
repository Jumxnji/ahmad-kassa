import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

const NEWSLETTER_SETTINGS_ID = "newsletter";

/**
 * Unlike SiteSettings/HomepageContent (whose singleton rows the
 * production seed script does create — see
 * src/repositories/site-settings.repository.ts), NewsletterSettings
 * is only seeded by the local `prisma/seed.ts`, not
 * `prisma/seed.production.ts`. A plain `update()` against production
 * before this row exists fails with "No record was found for an
 * update" — confirmed directly against production. `upsert()` makes
 * saving from `/admin/newsletter/settings` self-healing regardless of
 * whether the seed gap above is ever closed; the schema's per-field
 * `@default`s fill in anything `data` doesn't already carry (the
 * settings form always submits the full object, so this only matters
 * on the very first save).
 */
export const newsletterSettingsRepository = {
  get() {
    return db.newsletterSettings.findUnique({ where: { id: NEWSLETTER_SETTINGS_ID } });
  },

  update(data: Prisma.NewsletterSettingsUncheckedUpdateInput) {
    return db.newsletterSettings.upsert({
      where: { id: NEWSLETTER_SETTINGS_ID },
      create: { id: NEWSLETTER_SETTINGS_ID, ...data } as Prisma.NewsletterSettingsUncheckedCreateInput,
      update: data,
    });
  },
};
