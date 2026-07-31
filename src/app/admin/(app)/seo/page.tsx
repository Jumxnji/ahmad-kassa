import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { SeoForm } from "@/dashboard/components/seo-form";
import { siteSettingsService } from "@/services/site-settings.service";
import { requirePageAccess } from "@/permissions/require-page-access";

export const metadata = { title: "SEO" };

export default async function AdminSeoPage() {
  await requirePageAccess("seo");
  const settings = await siteSettingsService.get();

  return (
    <div className="max-w-3xl space-y-6">
      <DashboardPageHeader
        title="SEO"
        description="Site-wide defaults used when a page doesn't set its own meta tags."
      />
      <SeoForm seo={settings?.defaultSeo ?? null} />
    </div>
  );
}
