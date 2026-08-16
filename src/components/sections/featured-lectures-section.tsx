import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { VideoCard } from "@/components/cards/video-card";
import { getAllLectures } from "@/lib/data/lectures";
import { siteConfig } from "@/config/site";

/**
 * A single editorial spotlight rather than a grid — every lecture is
 * honestly `status: "coming-soon"` (no recordings published yet), so
 * this leads with the one already categorized "Weekly Khutbah" and
 * keeps the coming-soon framing intact instead of implying a real
 * upload exists. `VideoCard`'s facade needs no changes once a real
 * `youtubeId` is set.
 */
export function LatestKhutbahSection() {
  const lectures = getAllLectures();
  const khutbah = lectures.find((l) => l.category === "Weekly Khutbah") ?? lectures[0];
  const youtubeUrl =
    siteConfig.socialLinks.find((link) => link.platform === "youtube")?.href ??
    "https://youtube.com";

  if (!khutbah) return null;

  return (
    <Section tone="alt">
      <ScrollReveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Latest khutbah</Eyebrow>
        <h2 className="mt-3 text-3xl sm:text-4xl">Friday reminders, in full</h2>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
          Jumu&rsquo;ah addresses from Masjid Al-Noor — recordings are on the
          way.
        </p>

        <div className="mx-auto mt-10 max-w-lg text-left">
          <VideoCard lecture={khutbah} />
        </div>

        <Button asChild variant="outline" size="lg" className="mt-10">
          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
            Watch more on YouTube
          </a>
        </Button>
      </ScrollReveal>
    </Section>
  );
}
