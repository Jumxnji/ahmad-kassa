import Link from "next/link";
import { Send } from "lucide-react";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { NewsletterTabs } from "@/dashboard/components/newsletter-tabs";
import { DataTable, type DataTableColumn } from "@/dashboard/components/data-table";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { NewCampaignDialog } from "@/dashboard/components/new-campaign-dialog";
import { CampaignRowActions } from "@/dashboard/components/campaign-row-actions";
import { TableSearchForm } from "@/dashboard/components/table-toolbar";
import { PaginationControls } from "@/dashboard/components/pagination-controls";
import { AutoSubmitSelect } from "@/dashboard/components/auto-submit-select";
import { EmptyState } from "@/components/shared/empty-state";
import { campaignService } from "@/services/campaign.service";
import { formatDate } from "@/lib/format";
import { buildListHref, pageCount, parseListQuery, type RawListSearchParams } from "@/lib/list-query";
import { CAMPAIGN_STATUS_LABEL, CAMPAIGN_STATUS_TONE } from "@/dashboard/newsletter-constants";
import { CAMPAIGN_STATUSES } from "@/schemas/campaign.schema";
import type { $Enums, Campaign } from "@/generated/prisma/client";

export const metadata = { title: "Newsletter — Campaigns" };

const BASE_PATH = "/admin/newsletter/campaigns";

interface CampaignsPageProps {
  searchParams: Promise<RawListSearchParams & { status?: string }>;
}

export default async function AdminCampaignsPage({ searchParams }: CampaignsPageProps) {
  const raw = await searchParams;
  const query = parseListQuery(raw, "createdAt");
  const statusFilter = raw.status as $Enums.CampaignStatus | undefined;

  const { rows: campaigns, total } = await campaignService.listPaged(query, { status: statusFilter });

  const columns: DataTableColumn<Campaign>[] = [
    {
      key: "internalName",
      header: "Campaign",
      sortKey: "internalName",
      cell: (c) => (
        <Link href={`${BASE_PATH}/${c.id}`} className="block">
          <p className="font-medium text-foreground hover:underline">{c.internalName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{c.subject || "No subject yet"}</p>
        </Link>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortKey: "status",
      cell: (c) => <StatusBadge label={CAMPAIGN_STATUS_LABEL[c.status]} tone={CAMPAIGN_STATUS_TONE[c.status]} />,
    },
    {
      key: "recipientCount",
      header: "Recipients",
      cell: (c) => (
        <span className="text-sm text-muted-foreground">
          {c.status === "SENT" || c.status === "PARTIALLY_FAILED" ? `${c.successCount} / ${c.recipientCount}` : "—"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      sortKey: "createdAt",
      cell: (c) => (
        <span className="text-sm text-muted-foreground">
          {formatDate((c.sentAt ?? c.createdAt).toISOString())}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-14",
      cell: (c) => <CampaignRowActions campaign={c} />,
    },
  ];

  const statusOptions = [
    { value: "", label: "All statuses" },
    ...CAMPAIGN_STATUSES.map((s) => ({ value: s, label: CAMPAIGN_STATUS_LABEL[s] })),
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Newsletter"
        description="Draft, preview, test, and send announcements to your active subscriber list."
        actions={<NewCampaignDialog />}
      />
      <NewsletterTabs />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TableSearchForm
          action={BASE_PATH}
          placeholder="Search campaigns…"
          defaultValue={query.q}
          preserve={{ sort: query.sort, dir: query.dir }}
        />
        <form action={BASE_PATH} method="GET" className="contents">
          {query.q && <input type="hidden" name="q" value={query.q} />}
          <AutoSubmitSelect name="status" defaultValue={statusFilter ?? ""} options={statusOptions} aria-label="Filter by status" />
        </form>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState
          icon={Send}
          title={query.q ? `No campaigns match "${query.q}"` : "No campaigns yet"}
          description={query.q ? "Try a different search term." : "Draft your first announcement to get started."}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={campaigns}
            getRowKey={(c) => c.id}
            sort={{ key: query.sort, dir: query.dir }}
            buildSortHref={(key, dir) =>
              buildListHref(BASE_PATH, query, { sort: key, dir, page: 1 }) +
              (statusFilter ? `&status=${statusFilter}` : "")
            }
          />
          <PaginationControls
            page={query.page}
            pageCount={pageCount(total, query.pageSize)}
            total={total}
            itemLabel="campaign"
            buildHref={(page) =>
              buildListHref(BASE_PATH, query, { page }) + (statusFilter ? `&status=${statusFilter}` : "")
            }
          />
        </>
      )}
    </div>
  );
}
