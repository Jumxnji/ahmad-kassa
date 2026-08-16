"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2, MailX, Send } from "lucide-react";
import { StateCard } from "@/components/shared/state-card";
import { Button } from "@/components/ui/button";
import { unsubscribeFromNewsletter, resubscribeToNewsletter } from "@/actions/public/newsletter";

type Stage = "confirm" | "unsubscribed" | "resubscribe-started";

export function UnsubscribeFlow({
  subscriberId,
  token,
  maskedEmail,
  initiallyUnsubscribed,
}: {
  subscriberId: string;
  token: string;
  maskedEmail: string;
  initiallyUnsubscribed: boolean;
}) {
  const [stage, setStage] = useState<Stage>(initiallyUnsubscribed ? "unsubscribed" : "confirm");
  const [isPending, startTransition] = useTransition();

  function handleUnsubscribe() {
    startTransition(async () => {
      const result = await unsubscribeFromNewsletter(subscriberId, token);
      if (result.outcome === "unsubscribed" || result.outcome === "already-unsubscribed") {
        setStage("unsubscribed");
      } else {
        toast.error("Something went wrong — please try again.");
      }
    });
  }

  function handleResubscribe() {
    startTransition(async () => {
      const result = await resubscribeToNewsletter(subscriberId, token);
      if (result.outcome === "started") {
        setStage("resubscribe-started");
      } else {
        toast.error("Something went wrong — please try again.");
      }
    });
  }

  if (stage === "confirm") {
    return (
      <StateCard
        icon={MailX}
        tone="warning"
        title="Unsubscribe from the newsletter?"
        description={`${maskedEmail} will stop receiving announcements from Ahmad Mohamed Kassa.`}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant="destructive" size="lg" disabled={isPending} onClick={handleUnsubscribe}>
            {isPending ? "Unsubscribing…" : "Confirm unsubscribe"}
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Cancel</Link>
          </Button>
        </div>
      </StateCard>
    );
  }

  if (stage === "unsubscribed") {
    return (
      <StateCard
        icon={CheckCircle2}
        tone="success"
        title="You're unsubscribed"
        description="You won't receive any more newsletter emails. Changed your mind?"
      >
        <Button variant="outline" size="lg" disabled={isPending} onClick={handleResubscribe}>
          {isPending ? "Resubscribing…" : "Resubscribe"}
        </Button>
      </StateCard>
    );
  }

  return (
    <StateCard
      icon={Send}
      tone="success"
      title="Almost there"
      description="Check your inbox to confirm your subscription again."
    />
  );
}
