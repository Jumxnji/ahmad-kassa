import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { SiteSettingsForm } from "@/dashboard/components/site-settings-form";
import { siteSettingsService } from "@/services/site-settings.service";
import { requirePageAccess } from "@/permissions/require-page-access";

export const metadata = { title: "Site Settings" };

export default async function AdminSiteSettingsPage() {
  await requirePageAccess("settings");
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
