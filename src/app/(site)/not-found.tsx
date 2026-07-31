import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Section containerWidth="content" className="text-center">
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-3 text-5xl sm:text-6xl">This page isn&rsquo;t here</h1>
      <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
        The page you&rsquo;re looking for may have moved or doesn&rsquo;t
        exist yet.
      </p>
      <ManuscriptDivider className="mx-auto mt-10 max-w-xs" />
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
