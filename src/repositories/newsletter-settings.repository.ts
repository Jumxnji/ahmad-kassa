import "server-only";
import { db } from "@/db/client";
import type { Prisma } from "@/generated/prisma/client";

const NEWSLETTER_SETTINGS_ID = "newsletter";

/**
 * The singleton row is guaranteed to exist after `prisma db seed` —
 * this is a plain update, not an upsert, matching the SiteSettings/
 * HomepageContent pattern (see src/repositories/site-settings.repository.ts).
 */
export const newsletterSettingsRepository = {
  get() {
    return db.newsletterSettings.findUnique({ where: { id: NEWSLETTER_SETTINGS_ID } });
  },

  update(data: Prisma.NewsletterSettingsUncheckedUpdateInput) {
    return db.newsletterSettings.update({ where: { id: NEWSLETTER_SETTINGS_ID }, data });
  },
};
