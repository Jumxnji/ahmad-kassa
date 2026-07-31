import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { TableSkeleton } from "@/dashboard/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Users"
        description="Who has access to the dashboard, and what they can do."
        actions={<Skeleton className="h-9 w-28" />}
      />
      <TableSkeleton rows={4} cols={4} />
    </div>
  );
}
