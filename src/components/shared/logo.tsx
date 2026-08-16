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
 * Mark + short name, reused across the header, footer, and loading
 * screen. `tone="inverted"` swaps to the white mark for navy/dark
 * grounds (footer); `tone="default"` uses the gold mark for paper
 * grounds (header).
 */
export function Logo({ className, tone = "default" }: LogoProps) {
  const inverted = tone === "inverted";

  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2.5 font-display text-xl tracking-tight",
        className
      )}
      aria-label={`${siteConfig.name} — home`}
    >
      <Image
        src={inverted ? "/brand/logo-mark-white.svg" : brand.logo.mark}
        alt=""
        width={24}
        height={34}
        className="h-8 w-auto shrink-0 transition-[opacity,transform] duration-300 group-hover:scale-105 group-hover:opacity-80"
        priority
      />
      <span
        className={cn(
          "hidden sm:inline",
          inverted ? "text-paper-50" : "text-foreground"
        )}
      >
        {siteConfig.shortName}
      </span>
    </Link>
  );
}
