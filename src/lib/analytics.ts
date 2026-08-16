"use client";

import { track } from "@vercel/analytics";

/**
 * The fixed set of events worth tracking (Sprint 9 brief) — every
 * call site imports this instead of calling Vercel's `track()`
 * directly, so the whole app has one place to see what's tracked and
 * one place to swap/add a provider later. Never pass an event
 * property that could identify someone (email addresses, question or
 * message text, names) — every property below is deliberately just a
 * category/label, never user-entered content.
 */
export type AnalyticsEvent =
  | { name: "newsletter_submitted"; props: { source: string } }
  | { name: "newsletter_confirmed" }
  | { name: "ask_ahmad_submitted"; props: { category: string } }
  | { name: "contact_submitted"; props: { reason: string } }
  | { name: "amazon_link_click"; props: { bookSlug: string } }
  | { name: "book_detail_view"; props: { bookSlug: string } }
  | { name: "external_video_click"; props: { lectureSlug: string } }
  | { name: "course_interest_click"; props: { courseSlug: string } };

export function trackEvent(event: AnalyticsEvent): void {
  if ("props" in event) {
    track(event.name, event.props);
  } else {
    track(event.name);
  }
}
