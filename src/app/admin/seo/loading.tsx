import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { FormSkeleton } from "@/dashboard/components/skeletons";

export default function SeoLoading() {
  return (
    <div className="max-w-3xl space-y-6">
      <DashboardPageHeader
        title="SEO"
        description="Site-wide defaults used when a page doesn't set its own meta tags."
      />
      <FormSkeleton sections={2} fieldsPerSection={2} />
    </div>
  );
}
