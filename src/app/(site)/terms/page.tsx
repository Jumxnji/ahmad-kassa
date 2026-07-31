import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms governing use of the Ahmad Kassa website and products.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Section containerWidth="content">
      <PageHeader eyebrow="Legal" title="Terms of Service" />
      <div className="mt-10 space-y-6 text-base leading-relaxed text-foreground/90">
        <p className="text-sm text-muted-foreground">
          Placeholder content — pending legal review before launch.
        </p>
        <p>
          These terms will govern your use of this website, including
          browsing content, subscribing to the newsletter, submitting
          questions, and — once enabled — purchasing books, courses, and
          digital products.
        </p>
        <h2 className="pt-4 text-2xl">Use of content</h2>
        <p>
          Terms covering how written and video content may be shared,
          quoted, or reproduced will be documented here.
        </p>
        <h2 className="pt-4 text-2xl">Purchases</h2>
        <p>
          Once Stripe checkout is enabled, this section will cover pricing,
          refunds, and access to digital products and courses.
        </p>
        <h2 className="pt-4 text-2xl">Contact</h2>
        <p>
          Questions about these terms can be sent through the{" "}
          <a href="/contact" className="underline underline-offset-4 hover:text-gold-600">
            contact page
          </a>
          .
        </p>
      </div>
    </Section>
  );
}
