import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { TeachingAreaRow } from "@/components/cards/teaching-area-card";

/**
 * The same real topic taxonomy already established site-wide by
 * `QuestionCategory` (Ask Ahmad's categories) and the planned Academy
 * courses — reused here, not invented, so this section is grounded in
 * subjects Ahmad genuinely teaches rather than a new marketing list.
 * Presented as a numbered editorial index, not a feature grid — see
 * `TeachingAreaRow`.
 */
const TEACHING_AREAS = [
  {
    title: "Aqeedah",
    description: "The foundations of Islamic belief, built from first principles.",
  },
  {
    title: "Fiqh",
    description: "Practical rulings and everyday jurisprudence, explained in plain language.",
  },
  {
    title: "Marriage & Family",
    description: "Rights, responsibilities, and mercy — for building and repairing a home.",
  },
  {
    title: "Ruqyah",
    description: "Practical, text-grounded guidance — what it is, and how to practice it soundly.",
  },
  {
    title: "Mental Health",
    description: "The Qur'an and Sunnah's framework for the nafs, grief, and anxiety.",
  },
] as const;

export function TeachingAreasSection() {
  return (
    <Section size="lg" className="pt-16 sm:pt-20">
      <ScrollReveal>
        <div className="border-t border-stone-200" />
        <div className="mt-10 max-w-xl sm:mt-12">
          <Eyebrow>Teaching areas</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl">What Ahmad teaches</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-balance">
            The subjects most asked about, most taught, and most written on —
            the through-line across his books, khutbahs, and the questions he
            answers directly.
          </p>
        </div>

        <div className="mt-12">
          {TEACHING_AREAS.map((area, i) => (
            <TeachingAreaRow key={area.title} index={i + 1} {...area} />
          ))}
        </div>
      </ScrollReveal>
    </Section>
  );
}
