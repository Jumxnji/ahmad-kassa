import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { FormSkeleton } from "@/dashboard/components/skeletons";

export default function HomepageLoading() {
  return (
    <div className="max-w-3xl space-y-6">
      <DashboardPageHeader
        title="Homepage"
        description="Edit the hero, about preview, featured book, and newsletter sections."
      />
      <FormSkeleton sections={4} />
    </div>
  );
}
