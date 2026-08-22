import { notFound } from "next/navigation";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { VideoForm } from "@/dashboard/components/video-form";
import { videoService } from "@/services/video.service";

export const metadata = { title: "Edit video" };

interface EditVideoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVideoPage({ params }: EditVideoPageProps) {
  const { id } = await params;
  const video = await videoService.get(id);

  if (!video) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <DashboardPageHeader title={video.title} description="Editing this video." />
      <VideoForm video={video} />
    </div>
  );
}
