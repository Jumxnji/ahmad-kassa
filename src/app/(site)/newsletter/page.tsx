import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Newsletter",
  description:
    "Book announcements, course launches, seminars, lectures, and articles from Ahmad Mohamed Kassa. No spam.",
  path: "/newsletter",
});

const RECEIVE = [
  "Book announcements",
  "Course launches",
  "Seminars",
  "Lectures",
  "Articles",
] as const;

export default function NewsletterPage() {
  return (
    <Section containerWidth="content" className="text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-gold-300 text-gold-600">
        <Mail className="size-5" strokeWidth={1.5} />
      </span>
      <PageHeader
        align="center"
        className="mx-auto mt-6"
        eyebrow="Newsletter"
        title="Stay connected, without the noise"
        description="Subscribe to hear about new releases and events, direct from Ahmad — no spam, unsubscribe anytime."
      />

      <ul className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        {RECEIVE.map((item) => (
          <li key={item} className="flex items-center gap-1.5">
            <span className="size-1 rounded-full bg-gold-500" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-10 max-w-sm">
        <NewsletterForm />
      </div>
    </Section>
  );
}
