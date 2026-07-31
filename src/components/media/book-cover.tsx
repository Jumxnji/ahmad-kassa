import Image from "next/image";
import { cn } from "@/lib/utils";

interface BookCoverProps {
  title: string;
  className?: string;
  size?: "sm" | "lg";
  cover?: { url: string; altText?: string | null; width?: number | null; height?: number | null } | null;
}

/**
 * Renders the real uploaded cover when one exists. Until then — or for
 * any book that never gets a commissioned cover — falls back to a
 * manuscript-styled placeholder (gold hairline frame, initial, thin
 * rules standing in for a title block) so the catalog still reads as
 * complete rather than broken. Swapping in a real cover later is a
 * Media Library upload, never a code change.
 */
export function BookCover({ title, className, size = "sm", cover }: BookCoverProps) {
  if (cover) {
    return (
      <div
        className={cn(
          "relative aspect-2/3 w-full overflow-hidden rounded-md bg-navy-900 shadow-[0_18px_40px_-16px_rgba(10,22,40,0.45)] ring-1 ring-black/10",
          className
        )}
      >
        <Image
          src={cover.url}
          alt={cover.altText || `Cover of ${title}`}
          fill
          sizes={size === "lg" ? "(min-width: 1024px) 24rem, 60vw" : "(min-width: 1024px) 16rem, 40vw"}
          className="object-cover"
          priority={size === "lg"}
        />
      </div>
    );
  }

  const initial = title.trim().charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "relative flex aspect-2/3 w-full items-center justify-center overflow-hidden rounded-md bg-navy-900 ring-1 ring-black/10",
        className
      )}
      style={{
        backgroundImage:
          "radial-gradient(120% 100% at 15% 0%, var(--navy-700) 0%, transparent 55%), linear-gradient(160deg, var(--navy-800) 0%, var(--navy-950) 100%)",
      }}
      role="img"
      aria-label={`Cover placeholder for ${title}`}
    >
      <div
        className={cn(
          "absolute inset-3 rounded-sm border border-gold-400/30",
          size === "lg" && "inset-5"
        )}
      />
      <span
        className={cn(
          "font-display italic text-gold-300/90",
          size === "lg" ? "text-7xl" : "text-4xl"
        )}
      >
        {initial}
      </span>
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 translate-y-6 rotate-45 bg-gold-400/70"
      />
    </div>
  );
}
