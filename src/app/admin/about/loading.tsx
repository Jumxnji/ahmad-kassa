import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { FormSkeleton } from "@/dashboard/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div className="max-w-3xl space-y-6">
      <DashboardPageHeader
        title="About"
        description="Biography, mission, and the timeline/education entries shown on the About page."
      />
      <div className="flex gap-2 border-b border-border pb-px">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
      <FormSkeleton sections={2} />
    </div>
  );
}
