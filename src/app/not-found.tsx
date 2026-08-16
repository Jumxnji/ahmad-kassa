import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { NotFoundContent } from "@/components/shared/not-found-content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * Root-level catch-all for genuinely unmatched URLs (a typo, a dead
 * link) — Next only reaches for this file when no route segment
 * matches at all, which means it renders outside every route group's
 * layout, including `(site)/layout.tsx`. Without this file, an
 * unmatched URL fell through to Next's bare default 404 instead of
 * the branded one, even though `(site)/not-found.tsx` already existed
 * — that scoped file only ever renders for a `notFound()` call from
 * *within* a matched `(site)` route (e.g. an invalid book slug), never
 * for a URL that matches nothing.
 *
 * SiteHeader/SiteFooter are rendered directly here (mirroring
 * `(site)/layout.tsx`) rather than inventing new chrome, so a visitor
 * who mistypes a URL still lands on something that looks like this
 * site, not a bare, disconnected page.
 */
export default function RootNotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </>
  );
}
