"use client";

import { useState } from "react";
import type { Lecture } from "@/types/content";
import { VideoThumbnail } from "@/components/media/video-thumbnail";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/analytics";

interface VideoCardProps {
  lecture: Lecture;
}

/**
 * Facade pattern: renders a static thumbnail until clicked, then
 * swaps in the YouTube iframe. Works today with `youtubeId`
 * undefined (thumbnail only, non-interactive) and needs no changes
 * once real recordings are published.
 */
export function VideoCard({ lecture }: VideoCardProps) {
  const [playing, setPlaying] = useState(false);
  const canPlay = Boolean(lecture.youtubeId);

  return (
    <div className="group/videocard flex flex-col">
      {playing && lecture.youtubeId ? (
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
          className="text-left disabled:cursor-default"
          aria-label={canPlay ? `Play ${lecture.title}` : `${lecture.title} — coming soon`}
        >
          <VideoThumbnail
            title={lecture.title}
            durationMinutes={lecture.durationMinutes}
            thumbnailUrl={lecture.coverImageUrl}
          />
        </button>
      )}

      <Badge
        variant="secondary"
        className="mt-4 w-fit border-none bg-gold-100 text-gold-700"
      >
        {lecture.category}
      </Badge>
      <h3 className="mt-2.5 font-display text-lg leading-snug text-foreground">
        {lecture.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {lecture.excerpt}
      </p>
    </div>
  );
}
