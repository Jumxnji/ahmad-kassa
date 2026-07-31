"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

const NETWORKS = (url: string, title: string) => [
  {
    label: "X",
    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    label: "Facebook",
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: "LinkedIn",
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
];

export function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently no-op.
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-eyebrow">Share</span>
      {NETWORKS(url, title).map((network) => (
        <Button key={network.label} asChild variant="outline" size="sm">
          <a href={network.href} target="_blank" rel="noopener noreferrer">
            {network.label}
          </a>
        </Button>
      ))}
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? <Check /> : <Link2 />}
        {copied ? "Copied" : "Copy link"}
      </Button>
    </div>
  );
}
