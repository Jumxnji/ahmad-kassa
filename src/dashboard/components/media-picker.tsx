"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Check, ImageOff, Loader2, Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { listMediaAction, uploadMediaAction } from "@/actions/admin/media.actions";
import { cn } from "@/lib/utils";
import type { $Enums, Media } from "@/generated/prisma/client";

export interface MediaPickerItem {
  id: string;
  url: string;
  thumbnailUrl?: string | null;
  filename: string;
}

const FOLDER_LABELS: Record<$Enums.MediaFolder, string> = {
  IMAGES: "Images",
  BOOK_COVERS: "Book covers",
  GALLERY: "Gallery",
  DOCUMENTS: "Documents",
  DOWNLOADS: "Downloads",
  VIDEOS: "Videos",
};

const FOLDER_ORDER: $Enums.MediaFolder[] = [
  "BOOK_COVERS",
  "GALLERY",
  "IMAGES",
  "DOCUMENTS",
  "DOWNLOADS",
  "VIDEOS",
];

function toItem(media: Media): MediaPickerItem {
  return { id: media.id, url: media.url, thumbnailUrl: media.thumbnailUrl, filename: media.filename };
}

/**
 * Shared picker dialog — search + folder filter over the existing
 * Media Library, plus inline upload, so choosing an image never
 * requires leaving the book (or homepage, article, etc.) editor.
 * Reused by both single-select (`MediaPickerField`) and multi-select
 * (`MediaGalleryField`) wrappers below.
 */
function MediaPickerDialog({
  open,
  onOpenChange,
  defaultFolder,
  multiple,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultFolder: $Enums.MediaFolder;
  multiple: boolean;
  onConfirm: (items: MediaPickerItem[]) => void;
}) {
  const [folder, setFolder] = useState<$Enums.MediaFolder>(defaultFolder);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<MediaPickerItem[]>([]);
  const [selected, setSelected] = useState<Map<string, MediaPickerItem>>(new Map());
  const [isLoading, startLoading] = useTransition();
  const [isUploading, startUploading] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset for the next open — adjusted during render (React's
  // recommended pattern for "state that depends on a prop changing")
  // rather than in an effect, which would cause an extra render pass.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setFolder(defaultFolder);
      setSelected(new Map());
    }
  }

  useEffect(() => {
    if (!open) return;
    startLoading(async () => {
      const result = await listMediaAction({ folder, search: search || undefined });
      if (result.success) setItems(result.data.map(toItem));
    });
  }, [open, folder, search]);

  function toggle(item: MediaPickerItem) {
    if (!multiple) {
      onConfirm([item]);
      onOpenChange(false);
      return;
    }
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.set(item.id, item);
      return next;
    });
  }

  function handleUpload(files: FileList) {
    startUploading(async () => {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("folder", folder);
        const result = await uploadMediaAction(formData);
        if (result.success) {
          const item = toItem(result.data);
          setItems((prev) => [item, ...prev]);
          if (!multiple) {
            onConfirm([item]);
            onOpenChange(false);
            return;
          }
          setSelected((prev) => new Map(prev).set(item.id, item));
        } else {
          toast.error(result.message);
        }
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{multiple ? "Add images" : "Choose an image"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {FOLDER_ORDER.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFolder(value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  folder === value
                    ? "border-navy-900 bg-navy-900 text-paper-50"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {FOLDER_LABELS[value]}
              </button>
            ))}
          </div>
          <Input
            placeholder="Search…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full sm:w-48"
          />
        </div>

        <div className="grid max-h-96 grid-cols-3 gap-2 overflow-y-auto rounded-lg border border-border bg-paper-50 p-2 sm:grid-cols-4">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files?.length) handleUpload(event.target.files);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-border text-muted-foreground transition-colors hover:border-gold-500 hover:text-gold-700"
          >
            {isUploading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                <Upload className="size-4" strokeWidth={1.5} />
                <span className="text-[0.65rem]">Upload new</span>
              </>
            )}
          </button>

          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-muted-foreground">
              <ImageOff className="size-5" strokeWidth={1.5} />
              No files in this folder yet.
            </div>
          ) : (
            items.map((item) => {
              const isSelected = selected.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item)}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-md ring-2 ring-transparent transition-all",
                    isSelected && "ring-gold-500"
                  )}
                >
                  <Image
                    src={item.thumbnailUrl || item.url}
                    alt={item.filename}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  {isSelected && (
                    <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-gold-500 text-navy-950">
                      <Check className="size-3" strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {multiple && (
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="gold"
              disabled={selected.size === 0}
              onClick={() => {
                onConfirm(Array.from(selected.values()));
                onOpenChange(false);
              }}
            >
              Use selected ({selected.size})
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface MediaPickerFieldProps {
  label: string;
  folder: $Enums.MediaFolder;
  value: MediaPickerItem | null;
  onChange: (value: MediaPickerItem | null) => void;
}

/** Single-image picker — pick an existing library image or upload a new one. */
export function MediaPickerField({ label, folder, value, onChange }: MediaPickerFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <div className="flex items-center gap-4">
        <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-paper-100">
          {value ? (
            <Image
              src={value.thumbnailUrl || value.url}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <ImageOff className="size-5 text-stone-400" strokeWidth={1.5} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
            {value ? "Replace" : "Choose image"}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
              <X data-icon="inline-start" />
              Remove
            </Button>
          )}
        </div>
      </div>
      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        defaultFolder={folder}
        multiple={false}
        onConfirm={(items) => onChange(items[0] ?? null)}
      />
    </div>
  );
}

interface MediaGalleryFieldProps {
  label: string;
  folder: $Enums.MediaFolder;
  value: MediaPickerItem[];
  onChange: (value: MediaPickerItem[]) => void;
}

/** Multi-image picker — an ordered set of existing/new library images. */
export function MediaGalleryField({ label, folder, value, onChange }: MediaGalleryFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <div className="flex flex-wrap gap-3">
        {value.map((item) => (
          <div
            key={item.id}
            className="group relative size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-paper-100"
          >
            <Image
              src={item.thumbnailUrl || item.url}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
            <button
              type="button"
              aria-label={`Remove ${item.filename}`}
              onClick={() => onChange(value.filter((v) => v.id !== item.id))}
              className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-navy-950/80 text-paper-50 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex size-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-gold-500 hover:text-gold-700"
        >
          <Plus className="size-4" strokeWidth={1.5} />
          <span className="text-[0.65rem]">Add</span>
        </button>
      </div>
      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        defaultFolder={folder}
        multiple
        onConfirm={(items) => {
          const merged = new Map(value.map((v) => [v.id, v]));
          for (const item of items) merged.set(item.id, item);
          onChange(Array.from(merged.values()));
        }}
      />
    </div>
  );
}
