import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Section } from "@/components/shared/section";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Log in",
  description: "Student accounts are not open yet.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <Section containerWidth="content" className="text-center">
      <EmptyState
        icon={Lock}
        title="Student accounts aren't open yet"
        description="The academy portal is being built. Join the newsletter to know the moment accounts open."
        action={
          <Button asChild variant="gold">
            <Link href="/newsletter">Join the newsletter</Link>
          </Button>
        }
      />
    </Section>
  );
}
