"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/dashboard/components/confirm-dialog";
import { deleteVideoAction, setVideoStatusAction } from "@/actions/admin/video.actions";
import type { $Enums } from "@/generated/prisma/client";

interface VideoRowActionsProps {
  id: string;
  title: string;
  youtubeId: string;
  status: $Enums.ContentStatus;
}

export function VideoRowActions({ id, title, youtubeId, status }: VideoRowActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleStatusToggle(checked: boolean) {
    startTransition(async () => {
      const result = await setVideoStatusAction(id, checked ? "PUBLISHED" : "DRAFT");
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Switch
        checked={status === "PUBLISHED"}
        onCheckedChange={handleStatusToggle}
        disabled={isPending}
        aria-label={status === "PUBLISHED" ? `Unpublish ${title}` : `Publish ${title}`}
      />
      <Button asChild variant="ghost" size="icon-sm" aria-label={`View ${title} on YouTube`}>
        <a href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="size-3.5" />
        </a>
      </Button>
      <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${title}`}>
        <Link href={`/admin/videos/${id}`}>
          <Pencil className="size-3.5" />
        </Link>
      </Button>
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label={`Delete ${title}`}>
            <Trash2 className="size-3.5" />
          </Button>
        }
        title={`Delete "${title}"?`}
        description="This can't be undone. If this video is assigned to a homepage khutbah slot, that slot will fall back automatically."
        onConfirm={async () => {
          const result = await deleteVideoAction(id);
          if (result.success) {
            toast.success(result.message);
            router.refresh();
          } else {
            toast.error(result.message);
          }
        }}
      />
    </div>
  );
}
