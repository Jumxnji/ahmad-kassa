import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { StatGridSkeleton, ListSkeleton, MediaGridSkeleton } from "@/dashboard/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewLoading() {
  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Overview"
        description="A quick read on what needs attention across the site."
      />
      <StatGridSkeleton />
      <div>
        <h2 className="text-lg font-medium text-foreground">Recent activity</h2>
        <div className="mt-4">
          <ListSkeleton rows={6} />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium text-foreground">Latest uploads</h2>
        <div className="mt-4">
          <MediaGridSkeleton count={6} />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium text-foreground">Future features</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
