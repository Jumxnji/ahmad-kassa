import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  page: number;
  pageCount: number;
  buildHref: (page: number) => string;
  total: number;
  itemLabel: string;
  className?: string;
}

const navClasses =
  "inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-navy-900/30 hover:text-foreground";
const disabledNavClasses = "pointer-events-none opacity-40";

export function PaginationControls({
  page,
  pageCount,
  buildHref,
  total,
  itemLabel,
  className,
}: PaginationControlsProps) {
  if (pageCount <= 1) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground",
        className
      )}
    >
      <p>
        {total} {itemLabel}
        {total === 1 ? "" : "s"} — page {page} of {pageCount}
      </p>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link href={buildHref(page - 1)} aria-label="Previous page" className={navClasses}>
            <ChevronLeft className="size-4" />
          </Link>
        ) : (
          <span aria-hidden="true" className={cn(navClasses, disabledNavClasses)}>
            <ChevronLeft className="size-4" />
          </span>
        )}
        {page < pageCount ? (
          <Link href={buildHref(page + 1)} aria-label="Next page" className={navClasses}>
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span aria-hidden="true" className={cn(navClasses, disabledNavClasses)}>
            <ChevronRight className="size-4" />
          </span>
        )}
      </div>
    </div>
  );
}
