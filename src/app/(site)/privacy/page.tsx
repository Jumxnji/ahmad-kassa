import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Ahmad Kassa collects, uses, and protects your information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Section containerWidth="content">
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <div className="mt-10 space-y-6 text-base leading-relaxed text-foreground/90">
        <p className="text-sm text-muted-foreground">
          Placeholder content — pending legal review before launch.
        </p>
        <p>
          This policy will describe what information is collected when you
          visit this site, subscribe to the newsletter, submit a question,
          or make a purchase — and how that information is used, stored,
          and protected.
        </p>
        <h2 className="pt-4 text-2xl">Information we collect</h2>
        <p>
          Details on contact form submissions, newsletter subscriptions,
          and — once payments are enabled — order information will be
          documented here.
        </p>
        <h2 className="pt-4 text-2xl">How we use it</h2>
        <p>
          This section will explain email communication, order fulfillment,
          and any analytics used to improve the site.
        </p>
        <h2 className="pt-4 text-2xl">Contact</h2>
        <p>
          Questions about this policy can be sent through the{" "}
          <a href="/contact" className="underline underline-offset-4 hover:text-gold-600">
            contact page
          </a>
          .
        </p>
      </div>
    </Section>
  );
}
