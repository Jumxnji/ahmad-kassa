import Image from "next/image";
import { Section } from "@/components/shared/section";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";

export function QuoteSection() {
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
      <ManuscriptDivider className="relative mx-auto max-w-xs bg-gold-400/40" />
      <blockquote className="relative mx-auto mt-10 max-w-2xl">
        <p className="font-display text-2xl italic leading-relaxed text-balance text-paper-50 sm:text-3xl">
          &ldquo;Seek knowledge from the cradle to the grave — and let it
          change how you live, not only what you know.&rdquo;
        </p>
      </blockquote>
      <p className="relative mt-6 text-eyebrow text-gold-400">Ahmad Mohamed Kassa</p>
    </Section>
  );
}
