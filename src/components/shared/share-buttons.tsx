"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {});
    } else {
      handleCopy();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="ghost" size="sm" onClick={handleCopy}>
        {copied ? <Check data-icon="inline-start" /> : <Link2 data-icon="inline-start" />}
        {copied ? "Copied" : "Copy link"}
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" aria-label="Share" onClick={handleShare}>
        <Share2 className="size-3.5" />
      </Button>
    </div>
  );
}
