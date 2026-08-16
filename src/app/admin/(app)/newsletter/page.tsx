import Link from "next/link";
import { AlertTriangle, Mail, Send, UserCheck, UserMinus, UserPlus, Users } from "lucide-react";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { NewsletterTabs } from "@/dashboard/components/newsletter-tabs";
import { StatCard } from "@/dashboard/components/stat-card";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { newsletterService } from "@/services/newsletter.service";
import { campaignService } from "@/services/campaign.service";
import { formatDate } from "@/lib/format";
import {
  SUBSCRIBER_STATUS_LABEL,
  SUBSCRIBER_STATUS_TONE,
  CAMPAIGN_STATUS_LABEL,
  CAMPAIGN_STATUS_TONE,
} from "@/dashboard/newsletter-constants";

export const metadata = { title: "Newsletter — Overview" };

export default async function AdminNewsletterOverviewPage() {
  const [counts, signedUpLast30, recentCampaigns, recentActivity, recentFailures] = await Promise.all([
    newsletterService.countByStatus(),
    newsletterService.countSignedUpInLastDays(30),
    campaignService.recent(5),
    newsletterService.recentActivity(8),
    newsletterService.recentFailures(5),
  ]);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Newsletter"
        description="A focused announcement system — new books, courses, seminars, and articles. Not a marketing newsletter."
      />
      <NewsletterTabs />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active subscribers" value={counts.ACTIVE} icon={UserCheck} href="/admin/newsletter/subscribers?status=ACTIVE" />
        <StatCard label="Pending confirmation" value={counts.PENDING} icon={UserPlus} href="/admin/newsletter/subscribers?status=PENDING" />
        <StatCard label="Unsubscribed" value={counts.UNSUBSCRIBED} icon={UserMinus} href="/admin/newsletter/subscribers?status=UNSUBSCRIBED" />
        <StatCard
          label="Suppressed / bounced"
          value={counts.SUPPRESSED + counts.BOUNCED + counts.COMPLAINED}
          icon={AlertTriangle}
          href="/admin/newsletter/subscribers?status=SUPPRESSED"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="New subscribers (last 30 days)" value={signedUpLast30} icon={Users} />
        <StatCard label="Campaigns sent" value={recentCampaigns.filter((c) => c.status === "SENT").length} icon={Send} href="/admin/newsletter/campaigns" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-medium text-foreground">Recent campaigns</h2>
          <div className="mt-4">
            {recentCampaigns.length === 0 ? (
              <EmptyState icon={Send} title="No campaigns yet" description="Draft your first announcement from the Campaigns tab." />
            ) : (
              <ul className="divide-y divide-border rounded-lg border border-border">
                {recentCampaigns.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/admin/newsletter/campaigns/${c.id}`}
                      className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-paper-100"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{c.internalName}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.subject}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <StatusBadge label={CAMPAIGN_STATUS_LABEL[c.status]} tone={CAMPAIGN_STATUS_TONE[c.status]} />
                        <span className="text-xs text-muted-foreground">
                          {formatDate((c.sentAt ?? c.createdAt).toISOString())}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-foreground">Recent subscription activity</h2>
          <div className="mt-4">
            {recentActivity.length === 0 ? (
              <EmptyState icon={Mail} title="Nothing yet" description="Signups, confirmations, and unsubscribes will show up here." />
            ) : (
              <ul className="divide-y divide-border rounded-lg border border-border">
                {recentActivity.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/admin/newsletter/subscribers/${s.id}`}
                      className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-paper-100"
                    >
                      <p className="truncate text-sm font-medium text-foreground">{s.email}</p>
                      <div className="flex shrink-0 items-center gap-3">
                        <StatusBadge label={SUBSCRIBER_STATUS_LABEL[s.status]} tone={SUBSCRIBER_STATUS_TONE[s.status]} />
                        <span className="text-xs text-muted-foreground">{formatDate(s.updatedAt.toISOString())}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {recentFailures.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-foreground">Recent email failures</h2>
          <div className="mt-4">
            <ul className="divide-y divide-border rounded-lg border border-destructive/30">
              {recentFailures.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/admin/newsletter/subscribers/${s.id}`}
                    className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-paper-100"
                  >
                    <p className="truncate text-sm font-medium text-foreground">{s.email}</p>
                    <span className="text-xs text-destructive">{s.emailFailureCount} failed attempt(s)</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
