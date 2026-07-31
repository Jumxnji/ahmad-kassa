import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseIllustrationProps {
  icon: LucideIcon;
  className?: string;
}

/**
 * Abstract stand-in for commissioned course artwork — a geometric
 * frame around the subject's icon, in the same manuscript language
 * used across covers and portraits.
 */
export function CourseIllustration({ icon: Icon, className }: CourseIllustrationProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-paper-100 ring-1 ring-border",
        className
      )}
      aria-hidden="true"
    >
      <div className="absolute size-32 rotate-45 rounded-2xl border border-gold-300/50" />
      <div className="absolute size-20 rotate-12 rounded-full border border-navy-800/10" />
      <span className="relative flex size-14 items-center justify-center rounded-full bg-navy-900 text-gold-300 shadow-md">
        <Icon className="size-6" strokeWidth={1.5} />
      </span>
    </div>
  );
}
