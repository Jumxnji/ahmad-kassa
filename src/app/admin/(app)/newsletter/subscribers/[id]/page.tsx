import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { SubscriberRowActions } from "@/dashboard/components/subscriber-row-actions";
import { Button } from "@/components/ui/button";
import { newsletterService } from "@/services/newsletter.service";
import { formatDate } from "@/lib/format";
import {
  SUBSCRIBER_STATUS_LABEL as STATUS_LABEL,
  SUBSCRIBER_STATUS_TONE as STATUS_TONE,
} from "@/dashboard/newsletter-constants";

export const metadata = { title: "Subscriber" };

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-border py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}

interface SubscriberDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminSubscriberDetailPage({ params }: SubscriberDetailPageProps) {
  const { id } = await params;
  const subscriber = await newsletterService.get(id);
  if (!subscriber) notFound();

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/admin/newsletter/subscribers">
          <ArrowLeft className="size-3.5" data-icon="inline-start" />
          Back to subscribers
        </Link>
      </Button>

      <DashboardPageHeader
        title={subscriber.email}
        description={subscriber.firstName || undefined}
        actions={<SubscriberRowActions subscriber={subscriber} />}
      />

      <div className="max-w-2xl rounded-lg border border-border bg-card px-5">
        <Field label="Status" value={<StatusBadge label={STATUS_LABEL[subscriber.status]} tone={STATUS_TONE[subscriber.status]} />} />
        <Field label="Source" value={subscriber.source} />
        <Field label="Preferred language" value={subscriber.preferredLanguage.toUpperCase()} />
        <Field label="Joined" value={formatDate(subscriber.createdAt.toISOString())} />
        <Field label="Confirmed" value={subscriber.confirmedAt ? formatDate(subscriber.confirmedAt.toISOString()) : "Not confirmed"} />
        <Field label="Unsubscribed" value={subscriber.unsubscribedAt ? formatDate(subscriber.unsubscribedAt.toISOString()) : "—"} />
        <Field label="Last email sent" value={subscriber.lastEmailSentAt ? formatDate(subscriber.lastEmailSentAt.toISOString()) : "Never"} />
        <Field label="Email failure count" value={subscriber.emailFailureCount} />
        <Field label="Suppression reason" value={subscriber.suppressionReason || "—"} />
        <Field label="Consent" value={subscriber.consentTextVersion ? `Version ${subscriber.consentTextVersion}, recorded ${subscriber.consentedAt ? formatDate(subscriber.consentedAt.toISOString()) : "—"}` : "—"} />
      </div>
    </div>
  );
}
