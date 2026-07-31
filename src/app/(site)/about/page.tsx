import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, School, GraduationCap, Briefcase } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";
import { PortraitFrame } from "@/components/media/portrait-frame";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "About Ahmad Mohamed Kassa — Islamic teacher, author, and Khateeb at Masjid Al-Noor, East London, teaching Ruqyah since 2009.",
  path: "/about",
});

const BADGES = ["Khateeb", "Author", "Islamic Speaker", "Ruqyah since 2009"] as const;

const EDUCATION = [
  {
    icon: School,
    title: "Religious Institute, Kuwait",
    detail: "Arabic and Islamic Studies, with foundational training under respected scholars.",
  },
  {
    icon: GraduationCap,
    title: "Computer Science & Telecommunications",
    detail: "An undergraduate degree preceding his professional academic career.",
  },
  {
    icon: GraduationCap,
    title: "PGCE, University of London",
    detail: "Postgraduate Certificate in Education — formal teacher training.",
  },
] as const;

const RESEARCH_INTERESTS = [
  "Aqeedah & classical theology",
  "Ruqyah & the unseen",
  "Islamic psychology",
  "Marriage & family fiqh",
  "Seerah & prophetic method",
  "Comparative religion",
] as const;

const TIMELINE = [
  {
    year: "Foundations",
    title: "Religious Institute, Kuwait",
    detail: "Arabic and Islamic Studies, receiving foundational training under respected scholars.",
  },
  {
    year: "Undergraduate",
    title: "Computer Science & Telecommunications",
    detail: "Completed a degree preceding his academic and consultancy career.",
  },
  {
    year: "Postgraduate",
    title: "PGCE, University of London",
    detail: "Postgraduate Certificate in Education, formalizing a teaching methodology.",
  },
  {
    year: "Career",
    title: "Academia & consultancy",
    detail: "Built a professional career alongside his Islamic studies and teaching.",
  },
  {
    year: "Community",
    title: "Khateeb, Masjid Al-Noor",
    detail: "Serves as Khateeb at Masjid Al-Noor in East London.",
  },
  {
    year: "2009",
    title: "Ruqyah education & practice",
    detail: "Actively involved in Ruqyah education and practice, teaching throughout the United Kingdom and internationally.",
  },
  {
    year: "2024",
    title: "Books published",
    detail: "The Great Debate released, with further titles on Ruqyah, Aqeedah, and Hajj in progress.",
  },
  {
    year: "Ahead",
    title: "The Academy",
    detail: "Structured courses are in active development.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_1fr] lg:gap-20">
          <PortraitFrame className="mx-auto max-w-sm lg:max-w-none" />
          <div>
            <Eyebrow>About</Eyebrow>
            <h1 className="mt-3 text-4xl leading-tight text-balance sm:text-5xl">
              Ahmad Mohamed Kassa
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              An Islamic teacher, author, and Khateeb committed to grounded
              scholarship — carried with the clarity today&rsquo;s seeker
              needs, without cutting corners on the tradition itself.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {BADGES.map((label) => (
                <Badge
                  key={label}
                  variant="secondary"
                  className="border-none bg-gold-100 text-gold-700"
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="alt" containerWidth="content">
        <Eyebrow>Biography</Eyebrow>
        <div className="mt-4 space-y-5 text-lg leading-relaxed text-foreground/90">
          <p>
            Ahmad Mohamed Kassa pursued Arabic and Islamic Studies at the
            Religious Institute in Kuwait, where he received foundational
            training under respected scholars.
          </p>
          <p>
            He also holds a degree in Computer Science and
            Telecommunications together with a Postgraduate Certificate in
            Education from the University of London.
          </p>
          <p>
            Alongside his professional background in academia and
            consultancy, he serves as Khateeb at Masjid Al-Noor in East
            London and has authored several books.
          </p>
          <p>
            Since 2009 he has been actively involved in Ruqyah education and
            practice, teaching throughout the United Kingdom and
            internationally.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Education</Eyebrow>
            <h2 className="mt-3 text-3xl">Formal training</h2>
            <ul className="mt-8 space-y-6">
              {EDUCATION.map(({ icon: Icon, title, detail }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-800">
                    <Icon className="size-4" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow>Professional background</Eyebrow>
            <h2 className="mt-3 text-3xl">Academia & consultancy</h2>
            <p className="mt-6 text-base leading-relaxed text-foreground/90">
              Alongside his Islamic studies, Ahmad has built a professional
              career in academia and consultancy. That background shapes the
              same structured, evidence-led approach he brings to teaching
              and writing.
            </p>
            <p className="mt-4 flex items-start gap-3 text-base leading-relaxed text-foreground/90">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-800">
                <Briefcase className="size-4" strokeWidth={1.5} />
              </span>
              <span>
                Two disciplines, one method: precision, structure, and
                evidence, applied equally to consultancy work and to Islamic
                scholarship.
              </span>
            </p>
          </div>
        </div>
      </Section>

      <Section tone="alt">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Islamic teaching</Eyebrow>
            <h2 className="mt-3 text-3xl">In the classroom</h2>
            <p className="mt-6 text-base leading-relaxed text-foreground/90">
              Ahmad&rsquo;s teaching favors first principles over
              memorization — building each subject from its foundations in
              the Qur&rsquo;an and Sunnah before layering in the reasoning
              of the classical scholars. Classes move deliberately, on the
              assumption that real competence takes longer than a single
              sitting.
            </p>
            <p className="mt-4 text-base leading-relaxed text-foreground/90">
              This same approach carries into the academy currently in
              development — sequenced courses rather than standalone
              lectures, so a student leaves with a structure to keep
              building on.
            </p>
          </div>

          <div>
            <Eyebrow>Public speaking</Eyebrow>
            <h2 className="mt-3 text-3xl">On the minbar and beyond</h2>
            <p className="mt-6 text-base leading-relaxed text-foreground/90">
              As Khateeb at Masjid Al-Noor in East London, Ahmad delivers
              weekly Khutbahs addressing both timeless obligations and
              present concerns. Beyond the Masjid, he teaches Ruqyah and
              speaks at seminars across the United Kingdom and
              internationally.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Books</Eyebrow>
            <h2 className="mt-3 text-3xl">Long-form writing</h2>
            <p className="mt-6 text-base leading-relaxed text-foreground/90">
              <em className="font-display italic">The Great Debate</em>,
              Ahmad&rsquo;s first published work, examines belief in God with
              the same rigor he brings to teaching. Further titles on
              Ruqyah, Aqeedah, and Hajj are in progress.
            </p>
            <Button asChild variant="outline" size="lg" className="mt-6">
              <Link href="/books">
                <BookOpen data-icon="inline-start" />
                Explore the books
              </Link>
            </Button>
          </div>

          <div>
            <Eyebrow>Research interests</Eyebrow>
            <h2 className="mt-3 text-3xl">What Ahmad studies</h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {RESEARCH_INTERESTS.map((interest) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="px-3 py-1 text-sm font-normal text-foreground/80"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="alt">
        <Eyebrow>Timeline</Eyebrow>
        <h2 className="mt-3 max-w-lg text-3xl">A path through study and practice</h2>
        <ol className="mt-12 space-y-0">
          {TIMELINE.map((item, index) => (
            <li key={item.year} className="relative flex gap-6 pb-10 last:pb-0">
              <div className="flex flex-col items-center">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gold-400 bg-background font-mono text-[0.65rem] text-gold-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {index < TIMELINE.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-gold-300/50" />
                )}
              </div>
              <div className="pt-0.5">
                <p className="text-eyebrow text-navy-600">{item.year}</p>
                <p className="mt-1.5 font-display text-xl text-foreground">
                  {item.title}
                </p>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="navy" containerWidth="content" className="text-center">
        <ManuscriptDivider className="mx-auto max-w-xs bg-gold-400/40" />
        <Eyebrow className="mt-10 text-gold-400">Mission</Eyebrow>
        <p className="mx-auto mt-4 max-w-2xl font-display text-2xl italic leading-relaxed text-balance text-paper-50 sm:text-3xl">
          To share authentic Islamic knowledge through education, research,
          and practical guidance — in service of the Muslim community.
        </p>
      </Section>

      <Section className="text-center">
        <Eyebrow>Future academy</Eyebrow>
        <h2 className="mx-auto mt-3 max-w-lg text-3xl sm:text-4xl">
          Building toward a structured academy
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Books, courses, and seminars are converging toward one goal: a
          sequenced path of study that takes a sincere beginner from first
          principles to real depth.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="gold" size="lg">
            <Link href="/newsletter">Join the newsletter</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/ask">Ask a question</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
