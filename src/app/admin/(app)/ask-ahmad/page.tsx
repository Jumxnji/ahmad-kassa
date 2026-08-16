import Link from "next/link";
import { Flag, Inbox } from "lucide-react";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { DataTable, type DataTableColumn } from "@/dashboard/components/data-table";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { TableSearchForm } from "@/dashboard/components/table-toolbar";
import { PaginationControls } from "@/dashboard/components/pagination-controls";
import { EmptyState } from "@/components/shared/empty-state";
import { AutoSubmitSelect } from "@/dashboard/components/auto-submit-select";
import { questionService } from "@/services/question.service";
import { formatDate } from "@/lib/format";
import { parseListQuery, pageCount, type ParsedListQuery } from "@/lib/list-query";
import { cn } from "@/lib/utils";
import {
  QUESTION_CATEGORY_LABEL as CATEGORY_LABEL,
  QUESTION_PRIORITY_TONE as PRIORITY_TONE,
  QUESTION_STATUS_LABEL as STATUS_LABEL,
  QUESTION_STATUS_TONE as STATUS_TONE,
} from "@/dashboard/ask-ahmad-constants";
import type { $Enums, Question } from "@/generated/prisma/client";

export const metadata = { title: "Ask Ahmad" };

const BASE_PATH = "/admin/ask-ahmad";

interface AskAhmadPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    dir?: string;
    page?: string;
    status?: string;
    category?: string;
    unread?: string;
  }>;
}

function buildHref(
  query: Pick<ParsedListQuery, "q" | "sort" | "dir">,
  extra: { status?: string; category?: string; unread?: string },
  overrides: { sort?: string; dir?: string; page?: number } = {}
) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  const sort = overrides.sort ?? query.sort;
  const dir = overrides.dir ?? query.dir;
  if (sort) params.set("sort", sort);
  if (dir) params.set("dir", dir);
  if (overrides.page && overrides.page > 1) params.set("page", String(overrides.page));
  if (extra.status) params.set("status", extra.status);
  if (extra.category) params.set("category", extra.category);
  if (extra.unread) params.set("unread", extra.unread);
  const qs = params.toString();
  return qs ? `${BASE_PATH}?${qs}` : BASE_PATH;
}

export default async function AdminAskAhmadPage({ searchParams }: AskAhmadPageProps) {
  const raw = await searchParams;
  const query = parseListQuery(raw, "createdAt");
  const statusFilter = raw.status as $Enums.QuestionStatus | undefined;
  const categoryFilter = raw.category as $Enums.QuestionCategory | undefined;
  const unreadOnly = raw.unread === "1";

  const { rows: questions, total } = await questionService.listPaged(query, {
    status: statusFilter,
    category: categoryFilter,
    unreadOnly,
  });

  const columns: DataTableColumn<Question>[] = [
    {
      key: "name",
      header: "From",
      sortKey: "name",
      cell: (q) => (
        <Link href={`${BASE_PATH}/${q.id}`} className="flex items-center gap-2">
          <span
            className={cn("size-1.5 shrink-0 rounded-full", !q.readAt ? "bg-gold-500" : "bg-transparent")}
            aria-hidden="true"
          />
          {q.flagged && <Flag className="size-3.5 shrink-0 fill-current text-destructive" />}
          <div>
            <p className={cn("text-foreground", !q.readAt ? "font-semibold" : "font-medium")}>{q.name}</p>
            <p className="text-xs text-muted-foreground">{q.email}</p>
          </div>
        </Link>
      ),
    },
    {
      key: "reference",
      header: "Reference",
      cell: (q) => <span className="font-mono text-xs text-stone-600">{q.referenceNumber}</span>,
    },
    {
      key: "question",
      header: "Question",
      cell: (q) => (
        <Link href={`${BASE_PATH}/${q.id}`} className="line-clamp-2 max-w-md text-sm text-foreground/80">
          {q.subject || q.initialMessage}
        </Link>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortKey: "category",
      cell: (q) => <StatusBadge label={CATEGORY_LABEL[q.category]} tone="neutral" />,
    },
    {
      key: "priority",
      header: "Priority",
      sortKey: "priority",
      cell: (q) => <StatusBadge label={q.priority} tone={PRIORITY_TONE[q.priority]} />,
    },
    {
      key: "status",
      header: "Status",
      sortKey: "status",
      cell: (q) => <StatusBadge label={STATUS_LABEL[q.status]} tone={STATUS_TONE[q.status]} />,
    },
    {
      key: "createdAt",
      header: "Received",
      sortKey: "createdAt",
      cell: (q) => (
        <span className="text-sm text-muted-foreground">{formatDate(q.createdAt.toISOString())}</span>
      ),
    },
  ];

  const statusOptions: { value: string; label: string }[] = [
    { value: "", label: "All statuses" },
    ...(Object.keys(STATUS_LABEL) as $Enums.QuestionStatus[]).map((s) => ({ value: s, label: STATUS_LABEL[s] })),
  ];
  const categoryOptions: { value: string; label: string }[] = [
    { value: "", label: "All categories" },
    ...(Object.keys(CATEGORY_LABEL) as $Enums.QuestionCategory[]).map((c) => ({ value: c, label: CATEGORY_LABEL[c] })),
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Ask Ahmad"
        description="Questions submitted through the public Ask Ahmad form."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TableSearchForm
          action={BASE_PATH}
          placeholder="Search name, email, reference…"
          defaultValue={query.q}
          preserve={{ sort: query.sort, dir: query.dir }}
        />
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref(query, { status: statusFilter, category: categoryFilter, unread: unreadOnly ? undefined : "1" })}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              unreadOnly
                ? "border-navy-900 bg-navy-900 text-paper-50"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            Unread only
          </Link>
          <form action={BASE_PATH} method="GET" className="contents">
            {query.q && <input type="hidden" name="q" value={query.q} />}
            {unreadOnly && <input type="hidden" name="unread" value="1" />}
            {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
            <AutoSubmitSelect
              name="status"
              defaultValue={statusFilter ?? ""}
              options={statusOptions}
              aria-label="Filter by status"
            />
          </form>
          <form action={BASE_PATH} method="GET" className="contents">
            {query.q && <input type="hidden" name="q" value={query.q} />}
            {unreadOnly && <input type="hidden" name="unread" value="1" />}
            {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
            <AutoSubmitSelect
              name="category"
              defaultValue={categoryFilter ?? ""}
              options={categoryOptions}
              aria-label="Filter by category"
            />
          </form>
        </div>
      </div>

      {questions.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={query.q ? `No questions match "${query.q}"` : "No questions yet"}
          description={query.q ? "Try a different search term." : "New questions will appear here."}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={questions}
            getRowKey={(q) => q.id}
            sort={{ key: query.sort, dir: query.dir }}
            buildSortHref={(key, dir) =>
              buildHref(query, { status: statusFilter, category: categoryFilter, unread: unreadOnly ? "1" : undefined }, { sort: key, dir, page: 1 })
            }
          />
          <PaginationControls
            page={query.page}
            pageCount={pageCount(total, query.pageSize)}
            total={total}
            itemLabel="question"
            buildHref={(page) =>
              buildHref(query, { status: statusFilter, category: categoryFilter, unread: unreadOnly ? "1" : undefined }, { page })
            }
          />
        </>
      )}
    </div>
  );
}
