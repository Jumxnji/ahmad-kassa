import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoThumbnailProps {
  title: string;
  durationMinutes?: number;
  /** A real thumbnail image (e.g. YouTube's own `maxresdefault`). Omit for the placeholder treatment. */
  thumbnailUrl?: string;
  sizes?: string;
  priority?: boolean;
  /** `"sm"` scales the play affordance down for a quieter, secondary placement. */
  size?: "default" | "sm";
  className?: string;
}

/**
 * A lecture's thumbnail — a real image once `thumbnailUrl` is set (see
 * `src/lib/data/lectures.ts`), or the original placeholder facade when
 * it isn't, so a future lecture without a recording yet still gets the
 * same honest "not available" treatment rather than a broken image. The
 * enclosing control (see `VideoCard`) always supplies the accessible
 * name via `aria-label`, so the real-image branch uses `alt=""` — an
 * un-announced decorative image, not a redundant second description.
 */
export function VideoThumbnail({
  title,
  durationMinutes,
  thumbnailUrl,
  sizes = "(min-width: 1024px) 480px, 90vw",
  priority,
  size = "default",
  className,
}: VideoThumbnailProps) {
  if (thumbnailUrl) {
    return (
      <div
        className={cn(
          "relative aspect-video w-full overflow-hidden rounded-lg ring-1 ring-black/10",
          className
        )}
      >
        <Image
          src={thumbnailUrl}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              "flex items-center justify-center rounded-full bg-gold-500/95 text-navy-950 shadow-lg transition-transform duration-300 group-hover/videocard:scale-110",
              size === "sm" ? "size-9" : "size-12"
            )}
          >
            <Play
              className={size === "sm" ? "ml-0.5 size-3.5" : "ml-0.5 size-5"}
              fill="currentColor"
              strokeWidth={0}
            />
          </span>
        </div>
        {durationMinutes && size !== "sm" && (
          <span className="absolute bottom-2.5 right-2.5 rounded bg-navy-950/80 px-1.5 py-0.5 font-mono text-[0.65rem] text-paper-50">
            {durationMinutes}m
          </span>
        )}
      </div>
    );
  }

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
