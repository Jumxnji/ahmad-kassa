import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
  /** Enables a clickable, sortable header for this column. */
  sortKey?: string;
}

interface DataTableSort {
  key: string;
  dir: "asc" | "desc";
}

interface DataTableProps<T> {
  columns: readonly DataTableColumn<T>[];
  rows: readonly T[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  /** Current sort state + href builder — omit to render plain (unsorted) headers. */
  sort?: DataTableSort;
  buildSortHref?: (sortKey: string, nextDir: "asc" | "desc") => string;
}

/**
 * Thin, typed wrapper around shadcn's Table — every dashboard list
 * screen (Books, Questions, Messages, Subscribers, Media, Users)
 * renders through this instead of hand-rolling <table> markup.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  sort,
  buildSortHref,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((col) => {
              const isSorted = sort && col.sortKey === sort.key;
              const ariaSort = isSorted ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined;

              return (
                <TableHead
                  key={col.key}
                  className={col.className}
                  aria-sort={col.sortKey ? (ariaSort ?? "none") : undefined}
                >
                  {col.sortKey && buildSortHref ? (
                    <Link
                      href={buildSortHref(col.sortKey, isSorted && sort!.dir === "asc" ? "desc" : "asc")}
                      className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                    >
                      {col.header}
                      {isSorted ? (
                        sort!.dir === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="size-3 text-stone-300" />
                      )}
                    </Link>
                  ) : (
                    col.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={getRowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(onRowClick && "cursor-pointer")}
            >
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
