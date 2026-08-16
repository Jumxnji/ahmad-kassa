import Image from "next/image";
import { cn } from "@/lib/utils";

interface ManuscriptDividerProps {
  className?: string;
  /** Swaps the rotated-square accent for a tiny gold mark glyph — reserve for one or two key transitions, not every divider. */
  mark?: boolean;
}

/**
 * The recurring signature motif: a thin gold hairline with a small
 * diamond mark at center, echoing a printer's section break in a
 * typeset manuscript. Used in the header, between sections, and in
 * the footer to tie the system together without ornamentation.
 */
export function ManuscriptDivider({ className, mark = false }: ManuscriptDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative h-px w-full bg-gold-300/60", className)}
    >
      {mark ? (
        <Image
          src="/brand/logo-mark.svg"
          alt=""
          width={24}
          height={34}
          className="absolute left-1/2 top-1/2 h-5 w-auto -translate-x-1/2 -translate-y-1/2 bg-background px-2"
        />
      ) : (
        <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold-500" />
      )}
    </div>
  );
}
