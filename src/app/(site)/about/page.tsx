import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";
import { PortraitFrame } from "@/components/media/portrait-frame";
import { PageBreadcrumbs } from "@/components/navigation/page-breadcrumbs";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/shared/json-ld";
import {
  buildMetadata,
  buildAboutPageJsonLd,
  buildBreadcrumbJsonLd,
  buildPersonJsonLd,
} from "@/lib/seo";
import { aboutService } from "@/services/about.service";
import { CURRENT_PORTRAIT } from "@/config/portrait";

const DEFAULT_DESCRIPTION =
  "About Ahmad Mohamed Kassa — Islamic teacher, author, and Khateeb at Masjid Al-Noor, East London, teaching Ruqyah since 2009.";

export async function generateMetadata(): Promise<Metadata> {
  const about = await aboutService.get();

  return buildMetadata({
    title: about?.seo?.metaTitle || "About",
    description: about?.seo?.metaDescription || DEFAULT_DESCRIPTION,
    path: "/about",
    noIndex: about?.seo?.noindex ?? false,
    useRouteOgImage: true,
  });
}

/** Same verified facts as the homepage About Preview's margin index — one set of truth, reused, not re-derived. */
const CREDENTIAL_INDEX = [
  "Arabic & Islamic Studies — Kuwait",
  "PGCE — University of London",
  "Khateeb — Masjid Al-Noor, East London",
  "Ruqyah — practising and teaching since 2009",
] as const;

const EDUCATION = [
  {
    label: "Foundations",
    title: "Religious Institute, Kuwait",
    detail: "Arabic and Islamic Studies, with foundational training under respected scholars.",
  },
  {
    label: "Undergraduate",
    title: "Computer Science & Telecommunications",
    detail: "An undergraduate degree preceding his professional academic career.",
  },
  {
    label: "Postgraduate",
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

export default function AboutPage() {
  return (
    <>
      <JsonLd data={buildAboutPageJsonLd()} />
      <JsonLd data={buildPersonJsonLd()} />
      <JsonLd data={buildBreadcrumbJsonLd([{ label: "About" }])} />

      <Section className="pt-14 sm:pt-16">
        <PageBreadcrumbs items={[{ label: "About" }]} />
        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20">
          <PortraitFrame
            src={CURRENT_PORTRAIT.about.src}
            alt={CURRENT_PORTRAIT.alt}
            priority
            className="mx-auto max-w-[14rem] sm:max-w-sm lg:sticky lg:top-28 lg:max-w-none"
          />

          <div>
            <Eyebrow>About</Eyebrow>
            <h1 className="mt-3 text-4xl leading-tight text-balance sm:text-5xl">
              Ahmad Mohamed Kassa
            </h1>
            <p className="mt-7 max-w-2xl font-display text-2xl leading-snug text-balance text-foreground/90 sm:text-3xl">
              An Islamic teacher, author, and Khateeb — trained in Arabic and
              Islamic Studies in Kuwait, and shaped by a parallel career in
              academia and consultancy.
            </p>

            <ul className="mt-8 max-w-sm space-y-2.5 border-t border-stone-200 pt-6 font-mono text-[11px] tracking-[0.06em] text-stone-500">
              {CREDENTIAL_INDEX.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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
        <ScrollReveal className="grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16">
          <div>
            <Eyebrow>Education</Eyebrow>
            <ul className="mt-6 space-y-6 border-t border-stone-200 pt-6">
              {EDUCATION.map(({ label, title, detail }) => (
                <li key={title}>
                  <p className="font-mono text-[11px] tracking-[0.06em] text-stone-400 uppercase">
                    {label}
                  </p>
                  <p className="mt-1.5 font-medium text-foreground">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pt-9">
            <h2 className="text-3xl">Academia & consultancy</h2>
            <p className="mt-6 text-base leading-relaxed text-foreground/90">
              Alongside his Islamic studies, Ahmad has built a professional
              career in academia and consultancy. That background shapes the
              same structured, evidence-led approach he brings to teaching
              and writing — two disciplines, one method: precision,
              structure, and evidence, applied equally to consultancy work
              and to Islamic scholarship.
            </p>
          </div>
        </ScrollReveal>
      </Section>

      <Section tone="alt">
        <ScrollReveal>
          <Eyebrow>Teaching & speaking</Eyebrow>
          <div className="mt-8 grid gap-10 border-t border-stone-200 pt-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="font-mono text-[11px] tracking-[0.06em] text-stone-400 uppercase">
                In the classroom
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">
                Ahmad&rsquo;s teaching favors first principles over
                memorization — building each subject from its foundations in
                the Qur&rsquo;an and Sunnah before layering in the reasoning
                of the classical scholars. Classes move deliberately, on the
                assumption that real competence takes longer than a single
                sitting. This same approach carries into the academy
                currently in development — sequenced courses rather than
                standalone lectures, so a student leaves with a structure to
                keep building on.
              </p>
            </div>

            <div>
              <p className="font-mono text-[11px] tracking-[0.06em] text-stone-400 uppercase">
                On the minbar and beyond
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">
                As Khateeb at Masjid Al-Noor in East London, Ahmad delivers
                weekly Khutbahs addressing both timeless obligations and
                present concerns. Beyond the Masjid, he teaches Ruqyah and
                speaks at seminars across the United Kingdom and
                internationally.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </Section>

      <Section>
        <ScrollReveal className="grid gap-12 lg:grid-cols-[0.6fr_0.4fr] lg:gap-16">
          <div>
            <Eyebrow>Books</Eyebrow>
            <h2 className="mt-3 text-3xl">Long-form writing</h2>
            <p className="mt-6 text-base leading-relaxed text-foreground/90">
              <em className="font-display italic">The Great Debate</em>,
              Ahmad&rsquo;s first published work, is a critical analysis of
              Ruqyah and the use of jinn in light of the Qur&rsquo;an and
              Sunnah. Further titles on Aqeedah and Hajj are in progress.
            </p>
            <Button asChild variant="outline" size="lg" className="mt-6">
              <Link href="/books">Explore the books</Link>
            </Button>
          </div>

          <div>
            <Eyebrow>Research interests</Eyebrow>
            <p className="mt-6 max-w-xs font-mono text-sm leading-loose tracking-[0.02em] text-stone-600">
              {RESEARCH_INTERESTS.join(" · ")}
            </p>
          </div>
        </ScrollReveal>
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
