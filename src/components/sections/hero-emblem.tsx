import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroEmblemProps {
  className?: string;
}

/**
 * Hero Mode A — the mark presented as a luxury seal: a soft gold
 * radial glow, a hairline medallion ring, the emblem centered inside.
 * Occupies the same aspect box `HeroPortrait` (Mode B) uses, so
 * switching `HERO_VISUAL` in hero.tsx swaps this for a real portrait
 * later with no layout change.
 */
export function HeroEmblem({ className }: HeroEmblemProps) {
  return (
    <div
      className={cn(
        "relative mx-auto flex aspect-square w-full max-w-md items-center justify-center",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          backgroundImage:
            "radial-gradient(65% 65% at 50% 50%, var(--gold-50) 0%, transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full ring-1 ring-gold-400/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-[16%] rounded-full ring-1 ring-gold-400/20"
      />
      <Image
        src="/brand/logo-mark.svg"
        alt="Ahmad Mohamed Kassa"
        width={220}
        height={318}
        priority
        className="relative h-[46%] w-auto drop-shadow-[0_18px_36px_rgba(184,146,74,0.25)]"
      />
    </div>
  );
}
