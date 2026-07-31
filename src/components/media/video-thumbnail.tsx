import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoThumbnailProps {
  title: string;
  durationMinutes?: number;
  className?: string;
}

/**
 * Facade thumbnail for a lecture. Once `youtubeId` is set on the
 * Lecture record, the video card can swap this for a lazy-loaded
 * iframe on click without changing the surrounding layout.
 */
export function VideoThumbnail({
  title,
  durationMinutes,
  className,
}: VideoThumbnailProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg ring-1 ring-black/10",
        className
      )}
      style={{
        backgroundImage:
          "radial-gradient(80% 100% at 50% 100%, var(--navy-700) 0%, transparent 60%), linear-gradient(155deg, var(--navy-800) 0%, var(--navy-950) 100%)",
      }}
      role="img"
      aria-label={`Video thumbnail for ${title}`}
    >
      <span className="absolute inset-3 rounded-md border border-gold-400/20" />
      <span className="flex size-12 items-center justify-center rounded-full bg-gold-500/95 text-navy-950 shadow-lg transition-transform duration-300 group-hover/videocard:scale-110">
        <Play className="ml-0.5 size-5" fill="currentColor" strokeWidth={0} />
      </span>
      {durationMinutes && (
        <span className="absolute bottom-2.5 right-2.5 rounded bg-navy-950/80 px-1.5 py-0.5 font-mono text-[0.65rem] text-paper-50">
          {durationMinutes}m
        </span>
      )}
    </div>
  );
}
