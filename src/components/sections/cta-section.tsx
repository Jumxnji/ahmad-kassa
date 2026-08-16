import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export function CtaSection() {
  return (
    <Section tone="paper" containerWidth="content" className="text-center">
      <ScrollReveal>
        <ManuscriptDivider mark className="mx-auto mb-14 max-w-xs" />
        <Eyebrow>Ask Ahmad</Eyebrow>
        <h2 className="mt-3 text-3xl sm:text-4xl">Have a question in mind?</h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Submit a question on Aqeedah, Fiqh, or daily practice — answered
          directly, in plain language.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="gold" size="lg">
            <Link href="/ask">Ask a question</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/newsletter">Join the newsletter instead</Link>
          </Button>
        </div>
      </ScrollReveal>
    </Section>
  );
}
