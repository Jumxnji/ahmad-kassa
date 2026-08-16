import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";

/**
 * Shared by both `(site)/not-found.tsx` (a `notFound()` call from within a
 * matched route, e.g. an invalid book slug) and the root `not-found.tsx`
 * (a genuinely unmatched URL, which Next renders outside `(site)/layout.tsx`
 * entirely) — one implementation, two mount points, per
 * docs/PROJECT_MEMORY.md's route-protection precedent of never duplicating
 * a boundary's real content across files.
 */
export function NotFoundContent() {
  return (
    <Section containerWidth="content" className="text-center">
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-3 text-5xl sm:text-6xl">This page isn&rsquo;t here</h1>
      <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
        The page you&rsquo;re looking for may have moved or doesn&rsquo;t
        exist yet.
      </p>
      <ManuscriptDivider mark className="mx-auto mt-10 max-w-xs" />
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild variant="gold" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </Section>
  );
}
