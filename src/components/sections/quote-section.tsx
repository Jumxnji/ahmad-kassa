import { Section } from "@/components/shared/section";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";

export function QuoteSection() {
  return (
    <Section tone="navy" className="text-center">
      <ManuscriptDivider className="mx-auto max-w-xs bg-gold-400/40" />
      <blockquote className="mx-auto mt-10 max-w-2xl">
        <p className="font-display text-2xl italic leading-relaxed text-balance text-paper-50 sm:text-3xl">
          &ldquo;Seek knowledge from the cradle to the grave — and let it
          change how you live, not only what you know.&rdquo;
        </p>
      </blockquote>
      <p className="mt-6 text-eyebrow text-gold-400">Ahmad Mohamed Kassa</p>
    </Section>
  );
}
