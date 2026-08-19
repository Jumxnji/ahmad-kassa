import { ProgrammeEntry, type ProgrammeEntryData } from "@/components/catalog/programme-entry";

interface ProgrammeIndexProps {
  courses: readonly ProgrammeEntryData[];
}

/**
 * A vertical, numbered list of editorial entries — reads the same at
 * five programmes as it would at six or seven, with hairline dividers
 * doing the separating instead of a grid that produces an orphan
 * whenever the count isn't a multiple of its column count.
 */
export function ProgrammeIndex({ courses }: ProgrammeIndexProps) {
  if (courses.length === 0) {
    return (
      <p className="mt-16 text-sm text-muted-foreground">
        No programmes announced yet — check back soon.
      </p>
    );
  }

  return (
    <div className="mt-8 lg:mt-10">
      {courses.map((course, i) => (
        <ProgrammeEntry key={course.id} course={course} index={i + 1} />
      ))}
    </div>
  );
}
