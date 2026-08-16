import "server-only";
import { newsletterSettingsRepository } from "@/repositories/newsletter-settings.repository";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Schema-level defaults, mirrored here so callers still get sane
 * values before `prisma db seed` has run. Sender identity prefers
 * RESEND_FROM_EMAIL/RESEND_REPLY_TO_EMAIL when set, so a fresh
 * deployment's first-ever send uses the deployer's real domain rather
 * than this placeholder — the admin-editable NewsletterSettings row
 * (once saved) always takes precedence over both.
 */
export const NEWSLETTER_SETTINGS_DEFAULTS = {
  senderName: "Ahmad Kassa",
  senderEmail: process.env.RESEND_FROM_EMAIL || "newsletter@ahmadkassa.com",
  replyToEmail: (process.env.RESEND_REPLY_TO_EMAIL || null) as string | null,
  confirmationSubject: "Confirm your subscription",
  welcomeSubject: "Welcome — you're subscribed",
  defaultFooterText: null as string | null,
  businessAddress: null as string | null,
  defaultLanguage: "en",
  confirmationTokenExpiryHours: 48,
  testEmailAllowlist: [] as string[],
};

export const newsletterSettingsService = {
  async get() {
    const settings = await newsletterSettingsRepository.get();
    return settings ?? { id: "newsletter", updatedAt: new Date(), ...NEWSLETTER_SETTINGS_DEFAULTS };
  },

  update: (data: Partial<Prisma.NewsletterSettingsUncheckedUpdateInput>) =>
    newsletterSettingsRepository.update(data),

  /** `"Name <email>"` sender string for outgoing newsletter mail — never used for Ask Ahmad/Contact, which keep the default transactional sender. */
  async resolveFromAddress(): Promise<string> {
    const settings = await this.get();
    return `${settings.senderName} <${settings.senderEmail}>`;
  },
};
