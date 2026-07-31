import { cn } from "@/lib/utils";

interface PortraitFrameProps {
  className?: string;
}

/**
 * Stands in for a commissioned portrait of Ahmad. A photograph will
 * replace this directly inside the same aspect box once available —
 * every call site should keep working unchanged.
 */
export function PortraitFrame({ className }: PortraitFrameProps) {
  return (
    <div
      className={cn(
        "relative aspect-4/5 w-full overflow-hidden rounded-2xl ring-1 ring-black/10",
        className
      )}
      style={{
        backgroundImage:
          "radial-gradient(90% 70% at 50% 0%, var(--navy-700) 0%, transparent 60%), linear-gradient(175deg, var(--navy-800) 0%, var(--navy-950) 100%)",
      }}
      role="img"
      aria-label="Portrait placeholder for Ahmad Mohamed Kassa"
    >
      <div className="absolute inset-4 rounded-xl border border-gold-400/25" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-8xl italic text-gold-300/80">AK</span>
      </div>
      <span
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 h-px w-16 -translate-x-1/2 bg-gold-400/50"
      />
    </div>
  );
}
