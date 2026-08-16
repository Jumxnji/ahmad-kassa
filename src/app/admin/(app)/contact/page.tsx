import Link from "next/link";
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
import {
  buildListHref,
  pageCount,
  parseListQuery,
  type ParsedListQuery,
  type RawListSearchParams,
} from "@/lib/list-query";
import { cn } from "@/lib/utils";
import {
  CONTACT_STATUS_LABEL as STATUS_LABEL,
  CONTACT_STATUS_TONE as STATUS_TONE,
} from "@/dashboard/contact-constants";
import type { $Enums, ContactMessage } from "@/generated/prisma/client";

export const metadata = { title: "Contact Messages" };

const BASE_PATH = "/admin/contact";

interface ContactPageProps {
  searchParams: Promise<RawListSearchParams & { status?: string }>;
}

export default async function AdminContactPage({ searchParams }: ContactPageProps) {
  const raw = await searchParams;
  const query = parseListQuery(raw, "createdAt");
  const statusFilter = raw.status as $Enums.ContactStatus | undefined;

  const { rows: messages, total } = await contactService.listPaged(query, { status: statusFilter });

  function hrefWithStatus(
    status: string | undefined,
    overrides: Partial<Pick<ParsedListQuery, "sort" | "dir" | "page">> = {}
  ) {
    const base = buildListHref(BASE_PATH, query, overrides);
    if (!status) return base;
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}status=${status}`;
  }

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
      key: "subject",
      header: "Subject",
      cell: (m) => (
        <div>
          <p className="text-sm text-foreground/90">{m.subject || "—"}</p>
          <p className="line-clamp-1 max-w-md text-xs text-muted-foreground">{m.message}</p>
        </div>
      ),
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
      cell: (m) => <StatusBadge label={STATUS_LABEL[m.status]} tone={STATUS_TONE[m.status]} />,
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TableSearchForm
          action={BASE_PATH}
          placeholder="Search messages…"
          defaultValue={query.q}
          preserve={{ sort: query.sort, dir: query.dir }}
        />
        <div className="flex flex-wrap gap-2">
          {[
            { value: undefined, label: "All" },
            { value: "NEW", label: "Unread" },
            { value: "READ", label: "Read" },
            { value: "ARCHIVED", label: "Archived" },
          ].map((option) => (
            <Link
              key={option.label}
              href={hrefWithStatus(option.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                statusFilter === option.value
                  ? "border-navy-900 bg-navy-900 text-paper-50"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

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
            buildSortHref={(key, dir) => hrefWithStatus(statusFilter, { sort: key, dir, page: 1 })}
          />
          <PaginationControls
            page={query.page}
            pageCount={pageCount(total, query.pageSize)}
            total={total}
            itemLabel="message"
            buildHref={(page) => hrefWithStatus(statusFilter, { page })}
          />
        </>
      )}
    </div>
  );
}
