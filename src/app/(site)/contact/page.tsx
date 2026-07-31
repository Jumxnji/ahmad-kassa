import type { Metadata } from "next";
import { Calendar, Mail, Mic, Newspaper } from "lucide-react";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/components/forms/contact-form";
import {
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
} from "@/components/shared/social-icons";
import { SOCIAL_LINKS } from "@/constants/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch regarding speaking engagements, seminars, book enquiries, media requests, or general questions.",
  path: "/contact",
});

const ENQUIRY_TYPES = [
  { icon: Mic, label: "Speaking engagements & seminars" },
  { icon: Newspaper, label: "Media & press enquiries" },
  { icon: Calendar, label: "Book enquiries" },
] as const;

const SOCIAL_ICONS = {
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
} as const;

export default function ContactPage() {
  return (
    <Section containerWidth="wide">
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Speaking engagements, seminars, book enquiries, media requests, or anything else — for questions of Islamic knowledge, use Ask Ahmad instead."
      />

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div>
          <ul className="space-y-5">
            {ENQUIRY_TYPES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-800">
                  <Icon className="size-4.5" strokeWidth={1.5} />
                </span>
                <span className="text-base text-foreground/90">{label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 border-t border-border pt-8">
            <p className="text-eyebrow">Based in</p>
            <p className="mt-2 text-base text-foreground/90">
              East London, United Kingdom
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3">
            {SOCIAL_LINKS.map((link) => {
              const Icon = SOCIAL_ICONS[link.platform as keyof typeof SOCIAL_ICONS];
              if (!Icon) return null;
              return (
                <a
                  key={link.platform}
                  href={link.href}
                  aria-label={link.label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-stone-600 transition-colors hover:border-gold-400/60 hover:text-gold-600"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
            <a
              href="mailto:hello@ahmadkassa.com"
              aria-label="Email"
              className="flex size-9 items-center justify-center rounded-full border border-border text-stone-600 transition-colors hover:border-gold-400/60 hover:text-gold-600"
            >
              <Mail className="size-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
