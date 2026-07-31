import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

/**
 * Loading-state building blocks for src/app/admin/**\/loading.tsx.
 * Each admin route renders its real DashboardPageHeader instantly
 * (the title/description are static, not data) and skeletons only
 * the part that depends on a fetch.
 */

export function StatGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-none p-6 shadow-none ring-1 ring-border">
          <div className="flex items-start justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="size-8 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-8 w-14" />
        </Card>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-center justify-between gap-4 px-4 py-3.5">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/5" />
            <Skeleton className="h-3 w-1/5" />
          </div>
          <Skeleton className="h-3 w-16 shrink-0" />
        </li>
      ))}
    </ul>
  );
}

export function TableSkeleton({ rows = 6, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex gap-4 border-b border-border bg-paper-100/60 px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-4 py-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-3.5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton({
  sections = 3,
  fieldsPerSection = 3,
}: {
  sections?: number;
  fieldsPerSection?: number;
}) {
  return (
    <div className="space-y-8">
      {Array.from({ length: sections }).map((_, s) => (
        <Card key={s} className="border-none p-6 shadow-none ring-1 ring-border">
          <Skeleton className="h-4 w-32" />
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {Array.from({ length: fieldsPerSection }).map((_, f) => (
              <div key={f} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </Card>
      ))}
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

export function MediaGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full rounded-lg" />
      ))}
    </div>
  );
}
