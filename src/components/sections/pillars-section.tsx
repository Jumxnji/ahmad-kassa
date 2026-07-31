import { BookOpen, GraduationCap, Newspaper } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { PillarCard } from "@/components/cards/pillar-card";

const PILLARS = [
  {
    icon: BookOpen,
    title: "Books",
    description:
      "Long-form works on Aqeedah, Fiqh, and the Seerah — written for the reader building real understanding, not just familiarity.",
    href: "/books",
  },
  {
    icon: GraduationCap,
    title: "Courses",
    description:
      "Structured study, unhurried and sequenced — starting from first principles and building toward real competence.",
    href: "/courses",
    status: "Coming soon",
  },
  {
    icon: Newspaper,
    title: "Articles",
    description:
      "Shorter reflections on belief, practice, and the questions that come up in ordinary life.",
    href: "/articles",
  },
] as const;

export function PillarsSection() {
  return (
    <Section tone="alt">
      <div className="max-w-xl">
        <Eyebrow>What&rsquo;s here</Eyebrow>
        <h2 className="mt-3 text-3xl sm:text-4xl">Three ways to study</h2>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((pillar) => (
          <PillarCard key={pillar.title} {...pillar} />
        ))}
      </div>
    </Section>
  );
}
