import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { HomepageForm } from "@/dashboard/components/homepage-form";
import { homepageService } from "@/services/homepage.service";
import { bookService } from "@/services/book.service";
import { videoService } from "@/services/video.service";

export const metadata = { title: "Homepage" };

export default async function AdminHomepagePage() {
  const [homepage, books, videos] = await Promise.all([
    homepageService.get(),
    bookService.list(),
    videoService.list({ publishedOnly: true }),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <DashboardPageHeader
        title="Homepage"
        description="Edit the hero, about preview, featured book, featured khutbahs, and newsletter sections."
      />
      <HomepageForm homepage={homepage} books={books} videos={videos} />
    </div>
  );
}
