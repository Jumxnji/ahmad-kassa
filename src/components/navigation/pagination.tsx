import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

function pageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-16 flex items-center justify-center gap-2"
    >
      <Link
        href={pageHref(basePath, Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={cn(
          "flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground",
          currentPage === 1 && "pointer-events-none opacity-40"
        )}
      >
        <ChevronLeft className="size-4" />
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={pageHref(basePath, page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            "flex size-9 items-center justify-center rounded-full text-sm transition-colors",
            page === currentPage
              ? "bg-navy-900 text-paper-50"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {page}
        </Link>
      ))}

      <Link
        href={pageHref(basePath, Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={cn(
          "flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground",
          currentPage === totalPages && "pointer-events-none opacity-40"
        )}
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}
