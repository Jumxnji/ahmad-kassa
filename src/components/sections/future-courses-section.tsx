import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { FutureCourseCard } from "@/components/cards/future-course-card";
import { getAllCourses } from "@/lib/data/courses";

/**
 * The homepage teaser shows only the courses editorially marked
 * `featured` (Sprint 19) — a curated four, not the full catalog. Every
 * genuine course, featured or not, still appears on `/courses` via the
 * same `getAllCourses()` there.
 */
export function FutureCoursesSection() {
  const courses = getAllCourses().filter((course) => course.featured);

  return (
    <Section>
      <ScrollReveal>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <Eyebrow>The academy — coming soon</Eyebrow>
            <h2 className="mt-3 text-3xl sm:text-4xl">Sequenced study, in depth</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Structured courses in the areas asked about most — built for
              depth, not just completion.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="shrink-0">
            <Link href="/courses">View the academy</Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <FutureCourseCard key={course.id} course={course} />
          ))}
        </div>
      </ScrollReveal>
    </Section>
  );
}
