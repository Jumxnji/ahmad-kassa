import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { DataTable, type DataTableColumn } from "@/dashboard/components/data-table";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { BookRowActions } from "@/dashboard/components/book-row-actions";
import { TableSearchForm } from "@/dashboard/components/table-toolbar";
import { PaginationControls } from "@/dashboard/components/pagination-controls";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { bookService } from "@/services/book.service";
import { formatDate } from "@/lib/format";
import { buildListHref, pageCount, parseListQuery, type RawListSearchParams } from "@/lib/list-query";
import type { Book } from "@/generated/prisma/client";

export const metadata = { title: "Books" };

const BASE_PATH = "/admin/books";

interface BooksPageProps {
  searchParams: Promise<RawListSearchParams>;
}

export default async function AdminBooksPage({ searchParams }: BooksPageProps) {
  const query = parseListQuery(await searchParams, "createdAt");
  const { rows: books, total } = await bookService.listPaged(query);

  const columns: DataTableColumn<Book>[] = [
    {
      key: "title",
      header: "Title",
      sortKey: "title",
      cell: (book) => (
        <div>
          <p className="font-medium text-foreground">{book.title}</p>
          <p className="text-xs text-muted-foreground">/{book.slug}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (book) => (
        <div className="flex flex-wrap gap-1.5">
          {book.published ? (
            <StatusBadge label="Published" tone="success" />
          ) : (
            <StatusBadge label="Draft" tone="muted" />
          )}
          {book.comingSoon && <StatusBadge label="Coming soon" tone="warning" />}
          {book.featured && <StatusBadge label="Featured" tone="neutral" />}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Added",
      sortKey: "createdAt",
      cell: (book) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(book.createdAt.toISOString())}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24",
      cell: (book) => <BookRowActions id={book.id} title={book.title} />,
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Books"
        description="The catalog shown on the public Books page — supports any number of titles."
        actions={
          <Button asChild variant="gold">
            <Link href="/admin/books/new">
              <Plus data-icon="inline-start" />
              New book
            </Link>
          </Button>
        }
      />

      <TableSearchForm
        action={BASE_PATH}
        placeholder="Search books…"
        defaultValue={query.q}
        preserve={{ sort: query.sort, dir: query.dir }}
      />

      {books.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={query.q ? `No books match "${query.q}"` : "No books yet"}
          description={query.q ? "Try a different search term." : "Add the first title to the catalog."}
          action={
            !query.q && (
              <Button asChild variant="gold">
                <Link href="/admin/books/new">New book</Link>
              </Button>
            )
          }
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={books}
            getRowKey={(book) => book.id}
            sort={{ key: query.sort, dir: query.dir }}
            buildSortHref={(key, dir) => buildListHref(BASE_PATH, query, { sort: key, dir, page: 1 })}
          />
          <PaginationControls
            page={query.page}
            pageCount={pageCount(total, query.pageSize)}
            total={total}
            itemLabel="book"
            buildHref={(page) => buildListHref(BASE_PATH, query, { page })}
          />
        </>
      )}
    </div>
  );
}
