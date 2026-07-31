import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { TableSkeleton } from "@/dashboard/components/skeletons";

export default function ContactLoading() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Contact Messages"
        description="Enquiries submitted through the public Contact form."
      />
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
}
