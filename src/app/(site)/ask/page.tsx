import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { AskAhmadForm } from "@/components/forms/ask-ahmad-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Ask Ahmad",
  description: "Submit a question on marriage, family, aqeedah, fiqh, ruqyah, or mental health.",
  path: "/ask",
});

export default function AskPage() {
  return (
    <Section containerWidth="content">
      <PageHeader
        eyebrow="Ask Ahmad"
        title="Submit a question"
        description="Marriage, family, aqeedah, fiqh, ruqyah, mental health, or anything in between — answered directly, in plain language."
      />
      <div className="mt-12 max-w-xl">
        <AskAhmadForm />
      </div>
    </Section>
  );
}
