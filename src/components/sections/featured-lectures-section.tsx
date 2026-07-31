import { Button } from "@/components/ui/button";
import { Section } from "@/components/shared/section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { VideoCard } from "@/components/cards/video-card";
import { getAllLectures } from "@/lib/data/lectures";
import { siteConfig } from "@/config/site";

export function FeaturedLecturesSection() {
  const lectures = getAllLectures();
  const youtubeUrl =
    siteConfig.socialLinks.find((link) => link.platform === "youtube")?.href ??
    "https://youtube.com";

  return (
    <Section tone="alt">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-xl">
          <Eyebrow>Lectures</Eyebrow>
          <h2 className="mt-3 text-3xl sm:text-4xl">Watch and listen</h2>
        </div>
        <Button asChild variant="outline" size="lg" className="shrink-0">
          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
            Watch more
          </a>
        </Button>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {lectures.map((lecture) => (
          <VideoCard key={lecture.id} lecture={lecture} />
        ))}
      </div>
    </Section>
  );
}
