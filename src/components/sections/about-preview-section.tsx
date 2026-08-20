import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { PortraitFrame } from "@/components/media/portrait-frame";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { CURRENT_PORTRAIT } from "@/config/portrait";

const MARGIN_INDEX = [
  "Arabic & Islamic Studies — Kuwait",
  "PGCE — University of London",
  "Khateeb — Masjid Al-Noor, East London",
  "Ruqyah — practising and teaching since 2009",
] as const;

export function AboutPreviewSection() {
  return (
    <Section>
      <ScrollReveal className="grid items-start gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20">
        <PortraitFrame
          src={CURRENT_PORTRAIT.about.src}
          alt={CURRENT_PORTRAIT.alt}
          className="mx-auto max-w-xs lg:sticky lg:top-28 lg:max-w-none"
        />

        <div>
          <Eyebrow>Who teaches here</Eyebrow>
          <h2 className="mt-3 text-4xl sm:text-5xl">Ahmad Mohamed Kassa</h2>
          <p className="mt-3 text-sm tracking-[0.08em] text-stone-600 uppercase">
            Author &middot; Teacher &middot; Khateeb
          </p>

          <p className="mt-6 max-w-xl font-display text-2xl leading-snug text-balance text-foreground/90 sm:text-3xl">
            Bringing together Islamic teaching, 
            community service,
            and over 15 years of experience in Ruqyah.
          </p>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Ahmad Mohamed Kassa studied Arabic and Islamic Studies in Kuwait
            before completing a degree in Computer Science and
            Telecommunications and a PGCE at the University of London. He
            has taught Ruqyah in the UK and abroad since 2009 and serves as
            Khateeb at Masjid Al-Noor in East London.
          </p>

          <ul className="mt-8 max-w-xs space-y-2.5 border-t border-stone-200 pt-6 font-mono text-[11px] tracking-[0.06em] text-stone-500">
            {MARGIN_INDEX.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <Button asChild variant="outline" size="lg" className="mt-9">
            <Link href="/about">Read the full biography</Link>
          </Button>
        </div>
      </ScrollReveal>
    </Section>
  );
}
