import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { FormSkeleton } from "@/dashboard/components/skeletons";

export default function SiteSettingsLoading() {
  return (
    <div className="max-w-3xl space-y-6">
      <DashboardPageHeader
        title="Site Settings"
        description="Website identity, navigation, and brand details used across the public site."
      />
      <FormSkeleton sections={4} />
    </div>
  );
}
