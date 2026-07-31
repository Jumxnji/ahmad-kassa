"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type DragEvent } from "react";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
import { uploadMediaAction } from "@/actions/admin/media.actions";
import { cn } from "@/lib/utils";
import type { $Enums } from "@/generated/prisma/client";

/**
 * Wraps the media grid/list so files can be dropped anywhere over it,
 * not just through the "Upload files" button — uploads to whichever
 * folder is currently active.
 */
export function MediaDropzone({
  folder,
  children,
}: {
  folder: $Enums.MediaFolder;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, startTransition] = useTransition();

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (!files.length) return;

    startTransition(async () => {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("folder", folder);
        const result = await uploadMediaAction(formData);
        if (!result.success) toast.error(result.message);
      }
      router.refresh();
    });
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className="relative"
    >
      {children}
      {(isDragging || isUploading) && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gold-500 bg-paper-50/90 text-gold-700">
          <UploadCloud className={cn("size-6", isUploading && "animate-bounce")} strokeWidth={1.5} />
          <p className="text-sm font-medium">
            {isUploading ? "Uploading…" : `Drop to upload to ${folder.replace("_", " ").toLowerCase()}`}
          </p>
        </div>
      )}
    </div>
  );
}
