import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { PortraitFrame } from "@/components/media/portrait-frame";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

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
        <PortraitFrame className="mx-auto max-w-xs lg:sticky lg:top-28 lg:max-w-none" />

        <div>
          <Eyebrow>Who teaches here</Eyebrow>
          <h2 className="mt-3 text-4xl sm:text-5xl">Ahmad Mohamed Kassa</h2>

          <p className="mt-7 max-w-2xl font-display text-2xl leading-snug text-balance text-foreground/90 sm:text-3xl">
            An Islamic teacher, author, and Khateeb — trained in Arabic and
            Islamic Studies in Kuwait, and shaped by a parallel career in
            academia and consultancy.
          </p>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            He received foundational training under respected teachers before
            completing a degree in Computer Science and Telecommunications
            and a Postgraduate Certificate in Education from the University
            of London. Since 2009 he has taught Ruqyah in the United Kingdom
            and abroad, and serves as Khateeb at Masjid Al-Noor in East
            London — writing, teaching, and speaking within the community he
            serves.
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
