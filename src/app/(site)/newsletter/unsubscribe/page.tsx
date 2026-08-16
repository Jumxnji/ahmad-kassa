import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Section } from "@/components/shared/section";
import { StateCard } from "@/components/shared/state-card";
import { Button } from "@/components/ui/button";
import { UnsubscribeFlow } from "@/components/forms/unsubscribe-flow";
import { newsletterService } from "@/services/newsletter.service";
import { maskEmail } from "@/lib/format";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false } };

interface NewsletterUnsubscribePageProps {
  searchParams: Promise<{ sid?: string; token?: string }>;
}

export default async function NewsletterUnsubscribePage({ searchParams }: NewsletterUnsubscribePageProps) {
  const { sid, token } = await searchParams;
  const subscriber = sid && token ? await newsletterService.lookupByUnsubscribeToken(sid, token) : null;

  return (
    <Section containerWidth="content">
      {subscriber ? (
        <UnsubscribeFlow
          subscriberId={subscriber.id}
          token={token!}
          maskedEmail={maskEmail(subscriber.email)}
          initiallyUnsubscribed={subscriber.status === "UNSUBSCRIBED"}
        />
      ) : (
        <StateCard
          icon={XCircle}
          tone="destructive"
          title="This link isn't valid"
          description="It may be incomplete, or the subscription it points to no longer exists."
        >
          <Button asChild variant="outline" size="lg">
            <Link href="/">Back to the homepage</Link>
          </Button>
        </StateCard>
      )}
    </Section>
  );
}
