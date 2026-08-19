import Image from "next/image";
import { cn } from "@/lib/utils";

interface PortraitFrameProps {
  className?: string;
  /** A real photograph's path. Omit to fall back to the "no photo yet" emblem placeholder. */
  src?: string;
  alt?: string;
  /** Set on the one instance that's the largest above-the-fold image (the Hero). */
  priority?: boolean;
}

/**
 * Holds a portrait of Ahmad — a real photograph when `src` is supplied
 * (see `src/config/portrait.ts` for the current canonical crops), or the
 * emblem placeholder when it isn't, so any future call site without a
 * photo yet still gets the same "no photo yet" convention `HeroEmblem`
 * established, rather than a generic initials monogram.
 */
export function PortraitFrame({ className, src, alt, priority }: PortraitFrameProps) {
  if (src) {
    return (
      <div
        className={cn(
          "relative aspect-4/5 w-full overflow-hidden rounded-2xl ring-1 ring-black/10",
          className
        )}
      >
        <Image
          src={src}
          alt={alt ?? "Portrait of Ahmad Mohamed Kassa"}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 40vw, 80vw"
          className="object-cover"
        />
      </div>
    );
  }

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
        <Image
          src="/brand/logo-mark-white.svg"
          alt=""
          width={140}
          height={200}
          className="h-[34%] w-auto opacity-90"
        />
      </div>
      <span
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 h-px w-16 -translate-x-1/2 bg-gold-400/50"
      />
    </div>
  );
}
