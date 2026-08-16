"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  event: AnalyticsEvent;
}

/** A plain `<a>` that fires an analytics event on click before navigating — composes with `Button asChild` the same way a bare `<a>` does. */
export function TrackedLink({ event, onClick, ...props }: TrackedLinkProps) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    trackEvent(event);
    onClick?.(e);
  }

  return <a {...props} onClick={handleClick} />;
}
