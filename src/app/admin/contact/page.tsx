import { Mail } from "lucide-react";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { DataTable, type DataTableColumn } from "@/dashboard/components/data-table";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { ContactDetailSheet } from "@/dashboard/components/contact-detail-sheet";
import { TableSearchForm } from "@/dashboard/components/table-toolbar";
import { PaginationControls } from "@/dashboard/components/pagination-controls";
import { EmptyState } from "@/components/shared/empty-state";
import { contactService } from "@/services/contact.service";
import { formatDate } from "@/lib/format";
import { buildListHref, pageCount, parseListQuery, type RawListSearchParams } from "@/lib/list-query";
import type { ContactMessage } from "@/generated/prisma/client";

export const metadata = { title: "Contact Messages" };

const BASE_PATH = "/admin/contact";
const STATUS_TONE = { NEW: "warning", READ: "neutral", ARCHIVED: "muted" } as const;

interface ContactPageProps {
  searchParams: Promise<RawListSearchParams>;
}

export default async function AdminContactPage({ searchParams }: ContactPageProps) {
  const query = parseListQuery(await searchParams, "createdAt");
  const { rows: messages, total } = await contactService.listPaged(query);

  const columns: DataTableColumn<ContactMessage>[] = [
    {
      key: "name",
      header: "From",
      sortKey: "name",
      cell: (m) => (
        <div>
          <p className="font-medium text-foreground">{m.name}</p>
          <p className="text-xs text-muted-foreground">{m.email}</p>
        </div>
      ),
    },
    {
      key: "message",
      header: "Message",
      cell: (m) => <p className="line-clamp-2 max-w-md text-sm text-foreground/80">{m.message}</p>,
    },
    {
      key: "reason",
      header: "Reason",
      sortKey: "reason",
      cell: (m) => <StatusBadge label={m.reason} tone="neutral" />,
    },
    {
      key: "status",
      header: "Status",
      sortKey: "status",
      cell: (m) => <StatusBadge label={m.status} tone={STATUS_TONE[m.status]} />,
    },
    {
      key: "createdAt",
      header: "Received",
      sortKey: "createdAt",
      cell: (m) => (
        <span className="text-sm text-muted-foreground">{formatDate(m.createdAt.toISOString())}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (m) => <ContactDetailSheet message={m} />,
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Contact Messages"
        description="Enquiries submitted through the public Contact form."
      />

      <TableSearchForm
        action={BASE_PATH}
        placeholder="Search messages…"
        defaultValue={query.q}
        preserve={{ sort: query.sort, dir: query.dir }}
      />

      {messages.length === 0 ? (
        <EmptyState
          icon={Mail}
          title={query.q ? `No messages match "${query.q}"` : "No messages yet"}
          description={query.q ? "Try a different search term." : "New enquiries will appear here."}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={messages}
            getRowKey={(m) => m.id}
            sort={{ key: query.sort, dir: query.dir }}
            buildSortHref={(key, dir) => buildListHref(BASE_PATH, query, { sort: key, dir, page: 1 })}
          />
          <PaginationControls
            page={query.page}
            pageCount={pageCount(total, query.pageSize)}
            total={total}
            itemLabel="message"
            buildHref={(page) => buildListHref(BASE_PATH, query, { page })}
          />
        </>
      )}
    </div>
  );
}
