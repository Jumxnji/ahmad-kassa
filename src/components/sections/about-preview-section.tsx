import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { PortraitFrame } from "@/components/media/portrait-frame";

const CREDENTIALS = [
  "Religious Institute, Kuwait",
  "Computer Science & Telecommunications",
  "PGCE, University of London",
  "Ruqyah education since 2009",
] as const;

export function AboutPreviewSection() {
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_1fr] lg:gap-20">
        <PortraitFrame className="mx-auto max-w-sm lg:max-w-none" />

        <div>
          <Eyebrow>Who teaches here</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl">
            Ahmad Mohamed Kassa
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Ahmad Mohamed Kassa pursued Arabic and Islamic Studies at the
            Religious Institute in Kuwait, where he received foundational
            training under respected scholars. Alongside a professional
            background in academia and consultancy, he serves as Khateeb at
            Masjid Al-Noor in East London and has authored several books.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {CREDENTIALS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-foreground/85"
              >
                <span className="mt-2 size-1 shrink-0 rounded-full bg-gold-500" />
                {item}
              </li>
            ))}
          </ul>

          <Button asChild variant="outline" size="lg" className="mt-9">
            <Link href="/about">Read full biography</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
