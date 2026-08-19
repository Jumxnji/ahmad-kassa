import { cn } from "@/lib/utils";
import { PortraitFrame } from "@/components/media/portrait-frame";
import { CURRENT_PORTRAIT } from "@/config/portrait";

interface HeroPortraitProps {
  className?: string;
}

/**
 * Hero Mode B — the approved professional portrait (Sprint 17), a tight
 * editorial crop distinct from About's fuller framing. Occupies the exact
 * same aspect box `HeroEmblem` (Mode A) uses, so enabling this was
 * switching `HERO_VISUAL` in hero.tsx to `"portrait"` — no layout change.
 * Mode A stays in the codebase as the "no photo yet" fallback.
 */
export function HeroPortrait({ className }: HeroPortraitProps) {
  return (
    <PortraitFrame
      src={CURRENT_PORTRAIT.hero.src}
      alt={CURRENT_PORTRAIT.alt}
      priority
      className={cn(
        "mx-auto aspect-square w-full max-w-[260px] sm:max-w-sm lg:max-w-lg",
        className
      )}
    />
  );
}
