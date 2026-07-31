import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { MediaGridSkeleton } from "@/dashboard/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function MediaLoading() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Media Library"
        description="Images and files used across books, pages, and SEO — reusable everywhere."
      />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-14 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-14 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
      <MediaGridSkeleton />
    </div>
  );
}
