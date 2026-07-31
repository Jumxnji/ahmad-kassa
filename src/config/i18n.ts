/**
 * Multi-language architecture — configuration only.
 * No routing, middleware, or translation loading is wired up yet.
 * Locales are declared here so future work (next-intl or a custom
 * dictionary loader) has a single source of truth to build against.
 */

export const locales = ["en", "fr", "sw", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  sw: "Kiswahili",
  ar: "العربية",
};

export const rtlLocales: readonly Locale[] = ["ar"] as const;

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
