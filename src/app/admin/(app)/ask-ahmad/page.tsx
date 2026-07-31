import { Flag, Inbox } from "lucide-react";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { DataTable, type DataTableColumn } from "@/dashboard/components/data-table";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { QuestionDetailSheet } from "@/dashboard/components/question-detail-sheet";
import { TableSearchForm } from "@/dashboard/components/table-toolbar";
import { PaginationControls } from "@/dashboard/components/pagination-controls";
import { EmptyState } from "@/components/shared/empty-state";
import { questionService } from "@/services/question.service";
import { formatDate } from "@/lib/format";
import { buildListHref, pageCount, parseListQuery, type RawListSearchParams } from "@/lib/list-query";
import type { Question } from "@/generated/prisma/client";

export const metadata = { title: "Ask Ahmad" };

const BASE_PATH = "/admin/ask-ahmad";

const STATUS_TONE = {
  PENDING: "warning",
  ANSWERED: "success",
  ARCHIVED: "muted",
} as const;

interface AskAhmadPageProps {
  searchParams: Promise<RawListSearchParams>;
}

export default async function AdminAskAhmadPage({ searchParams }: AskAhmadPageProps) {
  const query = parseListQuery(await searchParams, "createdAt");
  const { rows: questions, total } = await questionService.listPaged(query);

  const columns: DataTableColumn<Question>[] = [
    {
      key: "name",
      header: "From",
      sortKey: "name",
      cell: (q) => (
        <div className="flex items-center gap-2">
          {q.flagged && <Flag className="size-3.5 shrink-0 fill-current text-destructive" />}
          <div>
            <p className="font-medium text-foreground">{q.name}</p>
            <p className="text-xs text-muted-foreground">{q.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "question",
      header: "Question",
      cell: (q) => <p className="line-clamp-2 max-w-md text-sm text-foreground/80">{q.question}</p>,
    },
    {
      key: "category",
      header: "Category",
      sortKey: "category",
      cell: (q) => <StatusBadge label={q.category.replace("_", " ")} tone="neutral" />,
    },
    {
      key: "status",
      header: "Status",
      sortKey: "status",
      cell: (q) => <StatusBadge label={q.status} tone={STATUS_TONE[q.status]} />,
    },
    {
      key: "createdAt",
      header: "Received",
      sortKey: "createdAt",
      cell: (q) => (
        <span className="text-sm text-muted-foreground">{formatDate(q.createdAt.toISOString())}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (q) => <QuestionDetailSheet question={q} />,
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Ask Ahmad"
        description="Questions submitted through the public Ask Ahmad form."
      />

      <TableSearchForm
        action={BASE_PATH}
        placeholder="Search questions…"
        defaultValue={query.q}
        preserve={{ sort: query.sort, dir: query.dir }}
      />

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
            buildSortHref={(key, dir) => buildListHref(BASE_PATH, query, { sort: key, dir, page: 1 })}
          />
          <PaginationControls
            page={query.page}
            pageCount={pageCount(total, query.pageSize)}
            total={total}
            itemLabel="question"
            buildHref={(page) => buildListHref(BASE_PATH, query, { page })}
          />
        </>
      )}
    </div>
  );
}
