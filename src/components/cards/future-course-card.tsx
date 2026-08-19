import type { Course } from "@/types/content";
import { CourseInterestLink } from "@/components/cards/course-interest-link";

const LEVEL_LABELS: Record<Course["level"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

interface FutureCourseCardProps {
  course: Course;
}

/**
 * The homepage's own editorial treatment for a future course — typography
 * and a thin rule carry the card, not an illustration panel. Deliberately
 * separate from `CourseCard` (the icon+badge version `/courses` still
 * uses) rather than modifying that shared component, so this section's
 * own refinement doesn't change `/courses`' presentation as a side effect.
 */
export function FutureCourseCard({ course }: FutureCourseCardProps) {
  return (
    <div className="group flex flex-col border border-stone-200 p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-gold-400/50 focus-within:-translate-y-1 focus-within:border-gold-400/50">
      <p className="font-mono text-[11px] tracking-[0.08em] text-stone-500 uppercase">
        Coming soon &middot; {LEVEL_LABELS[course.level]}
      </p>
      <h3 className="mt-4 font-display text-xl leading-snug text-foreground">
        {course.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {course.excerpt}
      </p>
      <CourseInterestLink courseSlug={course.slug} />
    </div>
  );
}
