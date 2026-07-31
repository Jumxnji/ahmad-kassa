import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export function NewsletterSection() {
  return (
    <Section tone="navy" className="text-center">
      <Eyebrow className="text-gold-400">Stay connected</Eyebrow>
      <h2 className="mx-auto mt-3 max-w-lg text-3xl text-paper-50 sm:text-4xl">
        One email, every new release
      </h2>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-stone-300">
        Book announcements, course launches, seminars, lectures, and
        articles — delivered straight from Ahmad. No spam.
      </p>
      <div className="mx-auto mt-8 max-w-sm">
        <NewsletterForm variant="footer" />
      </div>
      <ManuscriptDivider className="mx-auto mt-14 max-w-xs bg-gold-400/40" />
    </Section>
  );
}
