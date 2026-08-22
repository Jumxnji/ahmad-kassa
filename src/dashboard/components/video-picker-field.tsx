"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Video as VideoIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Video } from "@/generated/prisma/client";

interface VideoPickerFieldProps {
  label: string;
  description?: string;
  videos: readonly Video[];
  value: string | null;
  onChange: (id: string | null) => void;
}

/**
 * A rich picker over PUBLISHED-only videos — always shows
 * thumbnail+title+date+status, never a raw id, per the Homepage
 * editor's requirement to make Primary/Supporting1/Supporting2
 * selection unambiguous. Modeled on MediaPickerField's dialog pattern,
 * but reads from an already-fetched `videos` list rather than a
 * server round trip (the dataset is small — every published video).
 */
export function VideoPickerField({ label, description, videos, value, onChange }: VideoPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = videos.find((video) => video.id === value) ?? null;

  const filtered = videos.filter((video) =>
    video.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      {description && <p className="mb-2 text-xs text-muted-foreground">{description}</p>}
      <div className="flex items-center gap-4">
        <div className="relative flex aspect-video w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-paper-100">
          {selected ? (
            <Image src={selected.thumbnailUrl} alt="" fill sizes="112px" className="object-cover" />
          ) : (
            <VideoIcon className="size-5 text-stone-400" strokeWidth={1.5} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          {selected ? (
            <>
              <p className="truncate font-medium text-foreground">{selected.title}</p>
              <p className="text-xs text-muted-foreground">
                {selected.publishedAt ? formatDate(selected.publishedAt.toISOString()) : "No date"}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No video selected</p>
          )}
          <div className="mt-2 flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
              {selected ? "Change" : "Choose video"}
            </Button>
            {selected && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
                <X data-icon="inline-start" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Choose a video</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search published videos…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="max-h-96 space-y-1.5 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {videos.length === 0 ? "No published videos yet." : "No videos match your search."}
              </p>
            ) : (
              filtered.map((video) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => {
                    onChange(video.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border border-border p-2 text-left transition-colors hover:border-gold-500",
                    video.id === value && "border-gold-500 bg-gold-50/60"
                  )}
                >
                  <div className="relative aspect-video w-20 shrink-0 overflow-hidden rounded-md bg-navy-900">
                    <Image src={video.thumbnailUrl} alt="" fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{video.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {video.publishedAt ? formatDate(video.publishedAt.toISOString()) : "No date"}
                    </p>
                  </div>
                  <StatusBadge label="Published" tone="success" className="shrink-0" />
                  {video.id === value && <Check className="size-4 shrink-0 text-gold-600" />}
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
