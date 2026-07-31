import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { Section } from "@/components/shared/section";
import { EmptyState } from "@/components/shared/empty-state";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Academy Portal",
  description: "The academy learning portal — under construction.",
  path: "/academy",
  noIndex: true,
});

/**
 * Reserved route for the future course-taking experience (lessons,
 * progress, certificates). Not linked in navigation yet.
 */
export default function AcademyPortalPage() {
  return (
    <Section containerWidth="content" className="text-center">
      <EmptyState
        icon={GraduationCap}
        title="The academy portal isn't built yet"
        description="This is a reserved route for the future course-taking experience."
      />
    </Section>
  );
}
