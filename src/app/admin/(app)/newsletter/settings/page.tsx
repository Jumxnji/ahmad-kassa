import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { NewsletterTabs } from "@/dashboard/components/newsletter-tabs";
import { NewsletterSettingsForm } from "@/dashboard/components/newsletter-settings-form";
import { newsletterSettingsService } from "@/services/newsletter-settings.service";

export const metadata = { title: "Newsletter — Settings" };

export default async function AdminNewsletterSettingsPage() {
  const settings = await newsletterSettingsService.get();

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Newsletter" description="Sender identity, subject lines, and compliance defaults." />
      <NewsletterTabs />
      <NewsletterSettingsForm settings={settings} />
    </div>
  );
}
