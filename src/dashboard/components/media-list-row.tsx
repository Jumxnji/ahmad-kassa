import Image from "next/image";
import { FileText } from "lucide-react";
import { MediaActionsMenu } from "@/dashboard/components/media-actions-menu";
import { formatBytes, formatDate } from "@/lib/format";
import type { Media } from "@/generated/prisma/client";

type MediaWithUploader = Media & { uploadedBy: { id: string; name: string } | null };

const FOLDER_LABELS: Record<Media["folder"], string> = {
  IMAGES: "Images",
  BOOK_COVERS: "Book covers",
  GALLERY: "Gallery",
  DOCUMENTS: "Documents",
  DOWNLOADS: "Downloads",
  VIDEOS: "Videos",
};

export function MediaListRow({ media }: { media: MediaWithUploader }) {
  const isImage = media.mimeType.startsWith("image/");

  return (
    <div className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0">
      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-paper-100">
        {isImage ? (
          <Image
            src={media.thumbnailUrl || media.url}
            alt={media.altText ?? media.filename}
            width={44}
            height={44}
            className="size-full object-cover"
          />
        ) : (
          <FileText className="size-4 text-stone-400" strokeWidth={1.5} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{media.filename}</p>
        <p className="text-xs text-muted-foreground">
          {FOLDER_LABELS[media.folder]} · {formatBytes(media.size)}
          {media.uploadedBy && ` · ${media.uploadedBy.name}`}
        </p>
      </div>
      <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
        {formatDate(media.createdAt.toISOString())}
      </span>
      <MediaActionsMenu media={media} className="shrink-0" />
    </div>
  );
}
