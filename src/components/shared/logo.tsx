import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { brand } from "@/config/brand";

interface LogoProps {
  className?: string;
  tone?: "default" | "inverted";
}

/**
 * The digital lockup: official emblem + the live wordmark, composed
 * together rather than shipped as a flattened lockup file (see
 * public/brand/README.md). Reused across the header, footer, and
 * loading screen. `tone="inverted"` swaps to the white mark for
 * navy/dark grounds (footer); `tone="default"` uses the gold mark
 * for paper grounds (header). Always renders the full name — this is
 * the brand's primary identity and is never shortened for layout
 * convenience; at the narrowest widths the type steps down instead.
 */
export function Logo({ className, tone = "default" }: LogoProps) {
  const inverted = tone === "inverted";

  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2 sm:gap-2.5",
        className
      )}
      aria-label={`${siteConfig.name} — home`}
    >
      <Image
        src={inverted ? "/brand/logo-mark-white.svg" : brand.logo.mark}
        alt=""
        width={28}
        height={40}
        className="h-8 w-auto shrink-0 -translate-y-0.5 self-center transition-opacity duration-300 group-hover:opacity-80"
        priority
      />
      <span
        className={cn(
          "font-display text-base leading-none tracking-tight text-balance sm:text-lg lg:text-xl",
          inverted ? "text-paper-50" : "text-foreground"
        )}
      >
        {siteConfig.name}
      </span>
    </Link>
  );
}
