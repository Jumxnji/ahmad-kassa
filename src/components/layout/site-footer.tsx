import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";
import {
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
} from "@/components/shared/social-icons";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import {
  FOOTER_CONNECT,
  FOOTER_EXPLORE,
  FOOTER_LEGAL,
} from "@/constants/navigation";
import { SITE_TAGLINE, SOCIAL_LINKS } from "@/constants/site";
import { defaultLocale, localeLabels, locales } from "@/config/i18n";

const SOCIAL_ICONS = {
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
} as const;

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-eyebrow">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-stone-300 transition-colors hover:text-paper-50"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-navy-950 text-paper-50">
      <ManuscriptDivider className="bg-gold-400/30" />
      <Container width="ultra" className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm">
            <Logo tone="inverted" />
            <p className="mt-4 text-sm leading-relaxed text-stone-300">
              {SITE_TAGLINE}.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((link) => {
                const Icon = SOCIAL_ICONS[link.platform as keyof typeof SOCIAL_ICONS];
                if (!Icon) return null;
                return (
                  <Link
                    key={link.platform}
                    href={link.href}
                    aria-label={link.label}
                    className="flex size-9 items-center justify-center rounded-full border border-paper-50/15 text-stone-300 transition-colors hover:border-gold-400/60 hover:text-gold-400"
                  >
                    <Icon className="size-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <FooterLinkGroup title="Explore" links={FOOTER_EXPLORE} />
          <FooterLinkGroup title="Connect" links={FOOTER_CONNECT} />

          <div>
            <h3 className="text-eyebrow">Newsletter</h3>
            <p className="mt-4 text-sm leading-relaxed text-stone-300">
              Book announcements, courses, seminars &amp; articles — no spam.
            </p>
            <NewsletterForm variant="footer" source="FOOTER" className="mt-4" />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-paper-50/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone-500">
            &copy; {new Date().getFullYear()} Ahmad Mohamed Kassa. All rights
            reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_LEGAL.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-stone-400 transition-colors hover:text-paper-50"
              >
                {link.label}
              </Link>
            ))}
            <label className="sr-only" htmlFor="footer-locale">
              Language
            </label>
            <select
              id="footer-locale"
              disabled
              defaultValue={defaultLocale}
              className="rounded-md border border-paper-50/15 bg-transparent px-2 py-1 text-xs text-stone-400 disabled:cursor-not-allowed"
              aria-label="Language (more coming soon)"
            >
              {locales.map((locale) => (
                <option key={locale} value={locale} className="text-ink-900">
                  {localeLabels[locale]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Container>
    </footer>
  );
}
