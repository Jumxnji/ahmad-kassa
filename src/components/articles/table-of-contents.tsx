"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocEntry {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  items: readonly TocEntry[];
  className?: string;
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className={cn("space-y-3", className)}>
      <p className="text-eyebrow">On this page</p>
      <ul className="space-y-2.5 border-l border-border pl-4">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block text-sm leading-snug transition-colors",
                activeId === item.id
                  ? "font-medium text-gold-700"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
