import { cn } from "@/lib/utils";
import { PortraitFrame } from "@/components/media/portrait-frame";

interface HeroPortraitProps {
  className?: string;
}

/**
 * Hero Mode B — a commissioned portrait, once one exists. Occupies
 * the exact same aspect box `HeroEmblem` (Mode A) uses, on top of the
 * already-photo-ready `PortraitFrame`, so enabling this is switching
 * `HERO_VISUAL` in hero.tsx to `"portrait"` — no layout change.
 */
export function HeroPortrait({ className }: HeroPortraitProps) {
  return (
    <PortraitFrame
      className={cn("mx-auto aspect-square w-full max-w-md", className)}
    />
  );
}
