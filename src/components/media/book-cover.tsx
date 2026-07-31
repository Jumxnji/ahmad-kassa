import { cn } from "@/lib/utils";

interface BookCoverProps {
  title: string;
  className?: string;
  size?: "sm" | "lg";
}

/**
 * Cover art placeholder — no commissioned covers exist yet. Renders
 * a manuscript-styled panel (gold hairline frame, initial, thin
 * rules standing in for a title block) so cards and the detail page
 * read as a real catalog rather than empty boxes.
 */
export function BookCover({ title, className, size = "sm" }: BookCoverProps) {
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
