import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";
import { Section } from "@/components/shared/section";
import { EmptyState } from "@/components/shared/empty-state";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Dashboard",
  description: "Student dashboard — under construction.",
  path: "/dashboard",
  noIndex: true,
});

/**
 * Reserved route for the future student dashboard. Not linked in
 * navigation and not authenticated yet — exists so the URL and
 * layout shell are stable once auth is wired up.
 */
export default function DashboardPage() {
  return (
    <Section containerWidth="content" className="text-center">
      <EmptyState
        icon={LayoutDashboard}
        title="The dashboard isn't built yet"
        description="This is a reserved route for the future student dashboard."
      />
    </Section>
  );
}
