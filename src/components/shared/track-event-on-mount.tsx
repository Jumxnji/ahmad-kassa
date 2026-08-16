"use client";

import { useEffect, useRef } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

/** Fires a single analytics event once, on mount — for outcomes decided server-side (e.g. a confirmation link landing on "confirmed") that a Server Component can't call trackEvent() from directly. */
export function TrackEventOnMount({ event }: { event: AnalyticsEvent }) {
  const eventRef = useRef(event);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent(eventRef.current);
  }, []);

  return null;
}
