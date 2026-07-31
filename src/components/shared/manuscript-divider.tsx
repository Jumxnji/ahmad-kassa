import { cn } from "@/lib/utils";

interface ManuscriptDividerProps {
  className?: string;
}

/**
 * The recurring signature motif: a thin gold hairline with a small
 * diamond mark at center, echoing a printer's section break in a
 * typeset manuscript. Used in the header, between sections, and in
 * the footer to tie the system together without ornamentation.
 */
export function ManuscriptDivider({ className }: ManuscriptDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative h-px w-full bg-gold-300/60", className)}
    >
      <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold-500" />
    </div>
  );
}
