import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { SiteSettingsForm } from "@/dashboard/components/site-settings-form";
import { siteSettingsService } from "@/services/site-settings.service";

export const metadata = { title: "Site Settings" };

export default async function AdminSiteSettingsPage() {
  const settings = await siteSettingsService.get();

  return (
    <div className="max-w-3xl space-y-6">
      <DashboardPageHeader
        title="Site Settings"
        description="Website identity, navigation, and brand details used across the public site."
      />
      <SiteSettingsForm settings={settings} />
    </div>
  );
}
