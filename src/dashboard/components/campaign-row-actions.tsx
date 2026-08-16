"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/dashboard/components/confirm-dialog";
import { deleteCampaignAction } from "@/actions/admin/campaign.actions";
import { EDITABLE_CAMPAIGN_STATUSES } from "@/schemas/campaign.schema";
import type { Campaign } from "@/generated/prisma/client";

export function CampaignRowActions({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const canDelete = EDITABLE_CAMPAIGN_STATUSES.includes(
    campaign.status as (typeof EDITABLE_CAMPAIGN_STATUSES)[number]
  );

  if (!canDelete) return null;

  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label={`Delete ${campaign.internalName}`}>
          <Trash2 className="size-3.5" />
        </Button>
      }
      title="Delete this campaign?"
      description="This permanently deletes the draft. This can't be undone."
      onConfirm={async () => {
        const result = await deleteCampaignAction(campaign.id);
        if (result.success) {
          toast.success(result.message);
          router.refresh();
        } else {
          toast.error(result.message);
        }
      }}
    />
  );
}
