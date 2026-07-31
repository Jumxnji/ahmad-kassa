"use client";

import { useRef, useTransition } from "react";
import Image from "next/image";
import { ImageOff, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadMediaAction } from "@/actions/admin/media.actions";
import type { $Enums } from "@/generated/prisma/client";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  label: string;
  folder: $Enums.MediaFolder;
  value: { id: string; url: string } | null;
  onChange: (value: { id: string; url: string } | null) => void;
}

/**
 * Self-contained upload → Media row → id/url pair. Reused everywhere
 * a single image is attached to something (book cover, homepage hero,
 * site logo, SEO images) so upload handling only exists once.
 */
export function ImageUploadField({ label, folder, value, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  async function handleFile(file: File) {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);

    startTransition(async () => {
      const result = await uploadMediaAction(formData);
      if (result.success) {
        onChange({ id: result.data.id, url: result.data.url });
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <div className="flex items-center gap-4">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-paper-100">
          {isPending ? (
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          ) : value ? (
            <Image src={value.url} alt="" width={80} height={80} className="size-full object-cover" />
          ) : (
            <ImageOff className="size-5 text-stone-400" strokeWidth={1.5} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
              event.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
          >
            <Upload data-icon="inline-start" />
            {value ? "Replace" : "Upload"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => onChange(null)}
            >
              <X data-icon="inline-start" />
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
