"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the page has scrolled past `threshold` so headers
 * can pick up an elevation/border once content moves beneath them.
 */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
