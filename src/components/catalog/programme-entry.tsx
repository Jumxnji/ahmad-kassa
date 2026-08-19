"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Course } from "@/types/content";
import { trackEvent } from "@/lib/analytics";

const LEVEL_LABELS: Record<Course["level"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export type ProgrammeEntryData = Pick<Course, "id" | "slug" | "title" | "excerpt" | "level">;

interface ProgrammeEntryProps {
  course: ProgrammeEntryData;
  /** 1-based position in the programme index — the archival "01" label, not a claim about how many programmes exist. */
  index: number;
}

/**
 * The `/courses` index's own editorial entry — a numbered prospectus
 * line, not a card. Deliberately separate from the homepage's
 * `FutureCourseCard` (untouched, Sprint 19) and from `CourseCard`
 * (now unused by any live route — its icon illustration and pill
 * badge are exactly what this page removes). No real course-detail
 * route exists yet, so the title is plain text, never a link — the
 * natural place to add `href={`/courses/${course.slug}`}` once a
 * programme actually ships with a real detail page.
 */
export function ProgrammeEntry({ course, index }: ProgrammeEntryProps) {
  return (
    <article className="group/entry border-t border-stone-200 py-9 first:border-t-0 lg:flex lg:items-baseline lg:gap-12 lg:py-10">
      <div className="flex items-baseline gap-3 lg:w-36 lg:shrink-0 lg:flex-col lg:items-start lg:gap-2">
        <span className="font-mono text-xs tracking-[0.18em] text-gold-700 transition-colors duration-200 group-hover/entry:text-gold-600 group-focus-within/entry:text-gold-600">
          {String(index).padStart(2, "0")}
        </span>
        <span className="font-mono text-[11px] tracking-[0.08em] text-stone-400 uppercase">
          {LEVEL_LABELS[course.level]}
        </span>
      </div>

      <div className="mt-4 lg:mt-0">
        <h3 className="font-display text-2xl leading-snug text-foreground transition-transform duration-200 sm:text-3xl lg:group-hover/entry:translate-x-1 lg:group-focus-within/entry:translate-x-1">
          {course.title}
        </h3>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
          {course.excerpt}
        </p>
        <Link
          href="/newsletter"
          onClick={() =>
            trackEvent({ name: "course_interest_click", props: { courseSlug: course.slug } })
          }
          className="group/link mt-5 inline-flex items-center gap-1 text-sm font-medium text-navy-800 transition-colors hover:text-gold-600"
        >
          Notify me at launch
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
