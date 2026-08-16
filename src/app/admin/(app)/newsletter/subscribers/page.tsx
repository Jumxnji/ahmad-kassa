import Link from "next/link";
import { Users } from "lucide-react";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { NewsletterTabs } from "@/dashboard/components/newsletter-tabs";
import { DataTable, type DataTableColumn } from "@/dashboard/components/data-table";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { SubscriberRowActions } from "@/dashboard/components/subscriber-row-actions";
import { TableSearchForm } from "@/dashboard/components/table-toolbar";
import { PaginationControls } from "@/dashboard/components/pagination-controls";
import { ExportCsvButton } from "@/dashboard/components/export-csv-button";
import { AutoSubmitSelect } from "@/dashboard/components/auto-submit-select";
import { EmptyState } from "@/components/shared/empty-state";
import { newsletterService } from "@/services/newsletter.service";
import { formatDate } from "@/lib/format";
import { pageCount, parseListQuery, type RawListSearchParams } from "@/lib/list-query";
import { localeLabels, locales } from "@/config/i18n";
import {
  SUBSCRIBER_STATUS_LABEL as STATUS_LABEL,
  SUBSCRIBER_STATUS_TONE as STATUS_TONE,
  SUBSCRIBER_SOURCE_LABEL as SOURCE_LABEL,
} from "@/dashboard/newsletter-constants";
import type { $Enums, NewsletterSubscriber } from "@/generated/prisma/client";

export const metadata = { title: "Newsletter — Subscribers" };

const BASE_PATH = "/admin/newsletter/subscribers";

interface SubscribersPageProps {
  searchParams: Promise<RawListSearchParams & { status?: string; source?: string; language?: string }>;
}

function buildHref(
  query: { q: string; sort: string; dir: "asc" | "desc" },
  extra: { status?: string; source?: string; language?: string },
  overrides: { sort?: string; dir?: "asc" | "desc"; page?: number } = {}
) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  const sort = overrides.sort ?? query.sort;
  const dir = overrides.dir ?? query.dir;
  if (sort) params.set("sort", sort);
  if (dir) params.set("dir", dir);
  if (overrides.page && overrides.page > 1) params.set("page", String(overrides.page));
  if (extra.status) params.set("status", extra.status);
  if (extra.source) params.set("source", extra.source);
  if (extra.language) params.set("language", extra.language);
  const qs = params.toString();
  return qs ? `${BASE_PATH}?${qs}` : BASE_PATH;
}

export default async function AdminNewsletterSubscribersPage({ searchParams }: SubscribersPageProps) {
  const raw = await searchParams;
  const query = parseListQuery(raw, "createdAt");
  const statusFilter = raw.status as $Enums.SubscriberStatus | undefined;
  const sourceFilter = raw.source as $Enums.SubscriberSource | undefined;
  const languageFilter = raw.language;

  const { rows: subscribers, total } = await newsletterService.listPaged(query, {
    status: statusFilter,
    source: sourceFilter,
    language: languageFilter,
  });

  const columns: DataTableColumn<NewsletterSubscriber>[] = [
    {
      key: "email",
      header: "Email",
      sortKey: "email",
      cell: (s) => (
        <Link href={`${BASE_PATH}/${s.id}`} className="font-medium text-foreground hover:underline">
          {s.email}
        </Link>
      ),
    },
    {
      key: "firstName",
      header: "First name",
      sortKey: "firstName",
      cell: (s) => <span className="text-sm text-muted-foreground">{s.firstName || "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortKey: "status",
      cell: (s) => <StatusBadge label={STATUS_LABEL[s.status]} tone={STATUS_TONE[s.status]} />,
    },
    {
      key: "preferredLanguage",
      header: "Language",
      cell: (s) => <span className="text-sm text-muted-foreground uppercase">{s.preferredLanguage}</span>,
    },
    {
      key: "source",
      header: "Source",
      sortKey: "source",
      cell: (s) => <span className="text-sm text-muted-foreground">{SOURCE_LABEL[s.source]}</span>,
    },
    {
      key: "createdAt",
      header: "Joined",
      sortKey: "createdAt",
      cell: (s) => <span className="text-sm text-muted-foreground">{formatDate(s.createdAt.toISOString())}</span>,
    },
    {
      key: "confirmedAt",
      header: "Confirmed",
      sortKey: "confirmedAt",
      cell: (s) => (
        <span className="text-sm text-muted-foreground">
          {s.confirmedAt ? formatDate(s.confirmedAt.toISOString()) : "—"}
        </span>
      ),
    },
    {
      key: "lastEmailSentAt",
      header: "Last email sent",
      sortKey: "lastEmailSentAt",
      cell: (s) => (
        <span className="text-sm text-muted-foreground">
          {s.lastEmailSentAt ? formatDate(s.lastEmailSentAt.toISOString()) : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-56",
      cell: (s) => <SubscriberRowActions subscriber={s} />,
    },
  ];

  const statusOptions = [
    { value: "", label: "All statuses" },
    ...(Object.keys(STATUS_LABEL) as $Enums.SubscriberStatus[]).map((s) => ({ value: s, label: STATUS_LABEL[s] })),
  ];
  const sourceOptions = [
    { value: "", label: "All sources" },
    ...(Object.keys(SOURCE_LABEL) as $Enums.SubscriberSource[]).map((s) => ({ value: s, label: SOURCE_LABEL[s] })),
  ];
  const languageOptions = [
    { value: "", label: "All languages" },
    ...locales.map((locale) => ({ value: locale, label: localeLabels[locale] })),
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Newsletter"
        description="Manage announcement subscribers — search, filter, export, and moderate individual addresses."
        actions={<ExportCsvButton q={query.q} status={statusFilter} source={sourceFilter} />}
      />
      <NewsletterTabs />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TableSearchForm
          action={BASE_PATH}
          placeholder="Search email, first name…"
          defaultValue={query.q}
          preserve={{ sort: query.sort, dir: query.dir }}
        />
        <div className="flex flex-wrap gap-2">
          <form action={BASE_PATH} method="GET" className="contents">
            {query.q && <input type="hidden" name="q" value={query.q} />}
            {sourceFilter && <input type="hidden" name="source" value={sourceFilter} />}
            {languageFilter && <input type="hidden" name="language" value={languageFilter} />}
            <AutoSubmitSelect name="status" defaultValue={statusFilter ?? ""} options={statusOptions} aria-label="Filter by status" />
          </form>
          <form action={BASE_PATH} method="GET" className="contents">
            {query.q && <input type="hidden" name="q" value={query.q} />}
            {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
            {languageFilter && <input type="hidden" name="language" value={languageFilter} />}
            <AutoSubmitSelect name="source" defaultValue={sourceFilter ?? ""} options={sourceOptions} aria-label="Filter by source" />
          </form>
          <form action={BASE_PATH} method="GET" className="contents">
            {query.q && <input type="hidden" name="q" value={query.q} />}
            {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
            {sourceFilter && <input type="hidden" name="source" value={sourceFilter} />}
            <AutoSubmitSelect name="language" defaultValue={languageFilter ?? ""} options={languageOptions} aria-label="Filter by language" />
          </form>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <EmptyState
          icon={Users}
          title={query.q ? `No subscribers match "${query.q}"` : "No subscribers yet"}
          description={query.q ? "Try a different search term." : "People who join the newsletter will show up here."}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={subscribers}
            getRowKey={(s) => s.id}
            sort={{ key: query.sort, dir: query.dir }}
            buildSortHref={(key, dir) =>
              buildHref(query, { status: statusFilter, source: sourceFilter, language: languageFilter }, { sort: key, dir, page: 1 })
            }
          />
          <PaginationControls
            page={query.page}
            pageCount={pageCount(total, query.pageSize)}
            total={total}
            itemLabel="subscriber"
            buildHref={(page) =>
              buildHref(query, { status: statusFilter, source: sourceFilter, language: languageFilter }, { page })
            }
          />
        </>
      )}
    </div>
  );
}
