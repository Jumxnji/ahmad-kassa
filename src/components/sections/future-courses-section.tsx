import Link from "next/link";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { CourseCard } from "@/components/cards/course-card";
import { COURSE_ICONS } from "@/components/cards/course-icons";
import { getAllCourses } from "@/lib/data/courses";

export function FutureCoursesSection() {
  const courses = getAllCourses();

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
            <CourseCard
              key={course.id}
              course={course}
              icon={COURSE_ICONS[course.slug] ?? Brain}
            />
          ))}
        </div>
      </ScrollReveal>
    </Section>
  );
}
