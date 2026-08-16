import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Section } from "@/components/shared/section";
import { StateCard } from "@/components/shared/state-card";
import { Button } from "@/components/ui/button";
import { ResendConfirmationButton } from "@/components/forms/resend-confirmation-button";
import { TrackEventOnMount } from "@/components/shared/track-event-on-mount";
import { confirmNewsletterSubscription } from "@/actions/public/newsletter";

export const metadata: Metadata = { title: "Confirm your subscription", robots: { index: false } };

interface NewsletterConfirmPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function NewsletterConfirmPage({ searchParams }: NewsletterConfirmPageProps) {
  const { token } = await searchParams;
  const result = token ? await confirmNewsletterSubscription(token) : { outcome: "invalid" as const };

  return (
    <Section containerWidth="content">
      {result.outcome === "confirmed" && <TrackEventOnMount event={{ name: "newsletter_confirmed" }} />}

      {(result.outcome === "confirmed" || result.outcome === "already-confirmed") && (
        <StateCard
          icon={CheckCircle2}
          tone="success"
          title="You're subscribed"
          description={
            result.outcome === "confirmed"
              ? "Your email is confirmed — you'll hear about new books, courses, seminars, lectures, and articles as they happen."
              : "This address was already confirmed — there's nothing more to do."
          }
        >
          <Button asChild variant="outline" size="lg">
            <Link href="/">Back to the homepage</Link>
          </Button>
        </StateCard>
      )}

      {result.outcome === "expired" && (
        <StateCard
          icon={Clock}
          tone="warning"
          title="This link has expired"
          description="Confirmation links only stay valid for a couple of days. Request a new one and it'll be waiting in your inbox."
        >
          <ResendConfirmationButton email={result.subscriber.email} />
        </StateCard>
      )}

      {result.outcome === "invalid" && (
        <StateCard
          icon={XCircle}
          tone="destructive"
          title="This link isn't valid"
          description="It may have already been used, or the link may be incomplete. You can subscribe again from the newsletter page."
        >
          <Button asChild variant="outline" size="lg">
            <Link href="/newsletter">Go to the newsletter page</Link>
          </Button>
        </StateCard>
      )}
    </Section>
  );
}
