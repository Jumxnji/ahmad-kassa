import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { VideoForm } from "@/dashboard/components/video-form";

export const metadata = { title: "New video" };

export default function NewVideoPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <DashboardPageHeader title="New video" description="Add a YouTube video." />
      <VideoForm />
    </div>
  );
}
