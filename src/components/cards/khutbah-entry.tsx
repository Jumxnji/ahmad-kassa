"use client";

import { useState } from "react";
import type { Lecture } from "@/types/content";
import { VideoThumbnail } from "@/components/media/video-thumbnail";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface KhutbahEntryProps {
  lecture: Lecture;
  /** `"primary"` is the editorially-dominant latest khutbah; `"secondary"` is the quieter, smaller entry beside it. */
  variant?: "primary" | "secondary";
  className?: string;
}

function formatMonthYear(iso?: string): string | undefined {
  if (!iso) return undefined;
  return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

/**
 * Reuses the same click-to-play pattern `VideoCard` established (thumbnail
 * until clicked, then a lazy iframe, no autoplay on load) but without its
 * badge+excerpt card chrome — this section asked to read as an editorial
 * feature/secondary pairing, not a repeated card grid, so typography and
 * scale alone carry the hierarchy.
 */
export function KhutbahEntry({ lecture, variant = "primary", className }: KhutbahEntryProps) {
  const [playing, setPlaying] = useState(false);
  const canPlay = Boolean(lecture.youtubeId);
  const isPrimary = variant === "primary";

  const meta = ["Masjid Al-Noor", formatMonthYear(lecture.publishedAt), lecture.durationMinutes && `${lecture.durationMinutes} min`]
    .filter(Boolean)
    .join(" · ");

  const media =
    playing && lecture.youtubeId ? (
      <div className="aspect-video w-full overflow-hidden rounded-lg ring-1 ring-black/10">
        <iframe
          src={`https://www.youtube.com/embed/${lecture.youtubeId}?autoplay=1`}
          title={lecture.title}
          allow="accelerate-compute; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="size-full"
        />
      </div>
    ) : (
      <button
        type="button"
        onClick={() => {
          if (!canPlay) return;
          trackEvent({ name: "external_video_click", props: { lectureSlug: lecture.slug } });
          setPlaying(true);
        }}
        disabled={!canPlay}
        className="block w-full text-left disabled:cursor-default"
        aria-label={canPlay ? `Play ${lecture.title}` : `${lecture.title} — coming soon`}
      >
        <VideoThumbnail
          title={lecture.title}
          thumbnailUrl={lecture.coverImageUrl}
          durationMinutes={isPrimary ? lecture.durationMinutes : undefined}
          size={isPrimary ? "default" : "sm"}
          sizes={isPrimary ? "(min-width: 1024px) 480px, 90vw" : "(min-width: 640px) 180px, 35vw"}
        />
      </button>
    );

  if (isPrimary) {
    return (
      <div className={cn("group/videocard", className)}>
        {media}
        <h3 className="mt-4 font-display text-2xl leading-snug text-foreground sm:text-3xl">
          {lecture.title}
        </h3>
        {meta && (
          <p className="mt-2 font-mono text-xs tracking-[0.06em] text-stone-500 uppercase">
            {meta}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("group/videocard flex items-start gap-4", className)}>
      <div className="w-28 shrink-0 sm:w-36">{media}</div>
      <div className="min-w-0 pt-0.5">
        <h3 className="font-display text-base leading-snug text-foreground">{lecture.title}</h3>
        {meta && (
          <p className="mt-1.5 font-mono text-[10px] tracking-[0.06em] text-stone-500 uppercase">
            {meta}
          </p>
        )}
      </div>
    </div>
  );
}
