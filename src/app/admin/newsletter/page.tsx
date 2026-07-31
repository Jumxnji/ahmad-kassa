import { Users } from "lucide-react";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { DataTable, type DataTableColumn } from "@/dashboard/components/data-table";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { SubscriberRowActions } from "@/dashboard/components/subscriber-row-actions";
import { TableSearchForm } from "@/dashboard/components/table-toolbar";
import { PaginationControls } from "@/dashboard/components/pagination-controls";
import { ExportCsvButton } from "@/dashboard/components/export-csv-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { newsletterService } from "@/services/newsletter.service";
import { formatDate } from "@/lib/format";
import { buildListHref, pageCount, parseListQuery, type RawListSearchParams } from "@/lib/list-query";
import type { NewsletterSubscriber } from "@/generated/prisma/client";

export const metadata = { title: "Newsletter" };

const BASE_PATH = "/admin/newsletter";

interface NewsletterPageProps {
  searchParams: Promise<RawListSearchParams>;
}

export default async function AdminNewsletterPage({ searchParams }: NewsletterPageProps) {
  const query = parseListQuery(await searchParams, "createdAt");
  const { rows: subscribers, total } = await newsletterService.listPaged(query);
  const activeCount = await newsletterService.countSubscribed();

  const columns: DataTableColumn<NewsletterSubscriber>[] = [
    {
      key: "email",
      header: "Email",
      sortKey: "email",
      cell: (s) => <span className="font-medium text-foreground">{s.email}</span>,
    },
    {
      key: "language",
      header: "Language",
      cell: (s) => <span className="text-sm text-muted-foreground uppercase">{s.language}</span>,
    },
    {
      key: "subscribed",
      header: "Status",
      sortKey: "subscribed",
      cell: (s) =>
        s.subscribed ? (
          <StatusBadge label="Subscribed" tone="success" />
        ) : (
          <StatusBadge label="Unsubscribed" tone="muted" />
        ),
    },
    {
      key: "createdAt",
      header: "Joined",
      sortKey: "createdAt",
      cell: (s) => (
        <span className="text-sm text-muted-foreground">{formatDate(s.createdAt.toISOString())}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-32",
      cell: (s) => <SubscriberRowActions subscriber={s} />,
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Newsletter"
        description={`${activeCount} active subscriber${activeCount === 1 ? "" : "s"}.`}
        actions={
          <div className="flex items-center gap-2">
            <ExportCsvButton search={query.q} />
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button variant="gold" disabled>
                    New campaign
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Campaigns are coming in a future release.</TooltipContent>
            </Tooltip>
          </div>
        }
      />

      <TableSearchForm
        action={BASE_PATH}
        placeholder="Search subscribers…"
        defaultValue={query.q}
        preserve={{ sort: query.sort, dir: query.dir }}
      />

      {subscribers.length === 0 ? (
        <EmptyState
          icon={Users}
          title={query.q ? `No subscribers match "${query.q}"` : "No subscribers yet"}
          description={
            query.q ? "Try a different search term." : "People who join the newsletter will show up here."
          }
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={subscribers}
            getRowKey={(s) => s.id}
            sort={{ key: query.sort, dir: query.dir }}
            buildSortHref={(key, dir) => buildListHref(BASE_PATH, query, { sort: key, dir, page: 1 })}
          />
          <PaginationControls
            page={query.page}
            pageCount={pageCount(total, query.pageSize)}
            total={total}
            itemLabel="subscriber"
            buildHref={(page) => buildListHref(BASE_PATH, query, { page })}
          />
        </>
      )}
    </div>
  );
}
