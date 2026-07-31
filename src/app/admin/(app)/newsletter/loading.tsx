import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { TableSkeleton } from "@/dashboard/components/skeletons";

export default function NewsletterLoading() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Newsletter" description="Loading subscribers…" />
      <TableSkeleton rows={6} cols={4} />
    </div>
  );
}
