import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { PortraitFrame } from "@/components/media/portrait-frame";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { CURRENT_PORTRAIT } from "@/config/portrait";
import { homepageService } from "@/services/homepage.service";

/**
 * Reads the homepage's About-preview fields + credential list from the
 * CMS (Sprint 24) — replacing what was previously four hardcoded
 * strings and a hardcoded `MARGIN_INDEX` array. The portrait
 * deliberately stays sourced from `CURRENT_PORTRAIT`
 * (src/config/portrait.ts), never DB-driven — an explicit,
 * already-made architecture decision, not an oversight. The name
 * heading and CTA are likewise intentionally static — out of this
 * sprint's scope.
 */
export async function AboutPreviewSection() {
  const homepage = await homepageService.get();

  const credentials = homepage?.credentials ?? [];
  const eyebrow = homepage?.aboutEyebrow ?? "Who teaches here";
  const subtitle = homepage?.aboutSubtitle ?? "Author · Teacher · Khateeb";
  const lede = homepage?.aboutLede ?? "";
  const body = homepage?.aboutBody ?? "";

  return (
    <Section>
      <ScrollReveal className="grid items-start gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20">
        <PortraitFrame
          src={CURRENT_PORTRAIT.about.src}
          alt={CURRENT_PORTRAIT.alt}
          className="mx-auto max-w-xs lg:sticky lg:top-28 lg:max-w-none"
        />

        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-3 text-4xl sm:text-5xl">Ahmad Mohamed Kassa</h2>
          <p className="mt-3 text-sm tracking-[0.08em] text-stone-600 uppercase">{subtitle}</p>

          <p className="mt-6 max-w-xl font-display text-2xl leading-snug text-balance text-foreground/90 sm:text-3xl">
            {lede}
          </p>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{body}</p>

          {credentials.length > 0 && (
            <ul className="mt-8 max-w-xs space-y-2.5 border-t border-stone-200 pt-6 font-mono text-[11px] tracking-[0.06em] text-stone-500">
              {credentials.map((credential) => (
                <li key={credential.id}>{credential.label}</li>
              ))}
            </ul>
          )}

          <Button asChild variant="outline" size="lg" className="mt-9">
            <Link href="/about">Read the full biography</Link>
          </Button>
        </div>
      </ScrollReveal>
    </Section>
  );
}
