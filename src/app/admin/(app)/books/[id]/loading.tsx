import { Skeleton } from "@/components/ui/skeleton";
import { FormSkeleton } from "@/dashboard/components/skeletons";

export default function EditBookLoading() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="space-y-3 border-b border-border pb-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
      <FormSkeleton sections={4} />
    </div>
  );
}
