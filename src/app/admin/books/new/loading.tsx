import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { FormSkeleton } from "@/dashboard/components/skeletons";

export default function NewBookLoading() {
  return (
    <div className="max-w-3xl space-y-6">
      <DashboardPageHeader title="New book" description="Add a title to the catalog." />
      <FormSkeleton sections={4} />
    </div>
  );
}
