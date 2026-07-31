import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { TableSkeleton } from "@/dashboard/components/skeletons";

export default function AskAhmadLoading() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Ask Ahmad"
        description="Questions submitted through the public Ask Ahmad form."
      />
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
}
