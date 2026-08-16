import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { CampaignForm } from "@/dashboard/components/campaign-form";
import { Button } from "@/components/ui/button";
import { campaignService } from "@/services/campaign.service";
import { newsletterService } from "@/services/newsletter.service";
import { getCurrentUser } from "@/permissions/current-user";
import { can } from "@/permissions/permissions";

export const metadata = { title: "Edit campaign" };

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { id } = await params;
  const [campaign, activeSubscriberCount, user] = await Promise.all([
    campaignService.get(id),
    newsletterService.countActive(),
    getCurrentUser(),
  ]);

  if (!campaign) notFound();

  const canSend = user ? can(user.role, "campaigns", "send") : false;

  return (
    <div className="max-w-4xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/admin/newsletter/campaigns">
          <ArrowLeft className="size-3.5" data-icon="inline-start" />
          Back to campaigns
        </Link>
      </Button>

      <DashboardPageHeader title={campaign.internalName} description="Editing this campaign." />

      <CampaignForm campaign={campaign} activeSubscriberCount={activeSubscriberCount} canSend={canSend} />
    </div>
  );
}
