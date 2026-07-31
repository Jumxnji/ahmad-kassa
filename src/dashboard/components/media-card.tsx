import Image from "next/image";
import { FileText } from "lucide-react";
import { MediaActionsMenu } from "@/dashboard/components/media-actions-menu";
import { formatBytes } from "@/lib/format";
import type { Media } from "@/generated/prisma/client";

type MediaWithUploader = Media & { uploadedBy: { id: string; name: string } | null };

export function MediaCard({ media }: { media: MediaWithUploader }) {
  const isImage = media.mimeType.startsWith("image/");

  return (
    <div className="group/media relative overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex aspect-square items-center justify-center bg-paper-100">
        {isImage ? (
          <Image
            src={media.thumbnailUrl || media.url}
            alt={media.altText ?? media.filename}
            width={240}
            height={240}
            className="size-full object-cover"
          />
        ) : (
          <FileText className="size-8 text-stone-400" strokeWidth={1.5} />
        )}
      </div>
      <div className="p-2.5">
        <p className="truncate text-xs font-medium text-foreground">{media.filename}</p>
        <p className="text-[0.65rem] text-muted-foreground">{formatBytes(media.size)}</p>
      </div>
      <MediaActionsMenu
        media={media}
        className="absolute right-2 top-2 rounded-md bg-background/90 opacity-0 shadow-sm transition-opacity group-hover/media:opacity-100"
      />
    </div>
  );
}
