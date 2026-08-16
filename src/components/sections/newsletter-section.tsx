import Image from "next/image";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import type { $Enums } from "@/generated/prisma/client";

interface NewsletterSectionProps {
  source: $Enums.SubscriberSource;
}

export function NewsletterSection({ source }: NewsletterSectionProps) {
  return (
    <Section tone="navy" texture className="relative overflow-hidden text-center">
      <Image
        src="/brand/logo-mark-white.svg"
        alt=""
        aria-hidden="true"
        width={220}
        height={318}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
      />
      <div className="relative">
        <Eyebrow className="text-gold-400">Stay connected</Eyebrow>
        <h2 className="mx-auto mt-3 max-w-lg text-3xl text-paper-50 sm:text-4xl">
          One email, every new release
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-stone-300">
          Book announcements, course launches, seminars, lectures, and
          articles — delivered straight from Ahmad. No spam.
        </p>
        <div className="mx-auto mt-8 max-w-sm">
          <NewsletterForm variant="footer" source={source} />
        </div>
        <ManuscriptDivider className="mx-auto mt-14 max-w-xs bg-gold-400/40" />
      </div>
    </Section>
  );
}
