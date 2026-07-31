import { AboutForm } from "@/dashboard/components/about-form";
import { TimelineManager } from "@/dashboard/components/timeline-manager";
import { EducationManager } from "@/dashboard/components/education-manager";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aboutService } from "@/services/about.service";

export const metadata = { title: "About" };

export default async function AdminAboutPage() {
  const about = await aboutService.get();

  return (
    <div className="max-w-3xl space-y-6">
      <DashboardPageHeader
        title="About"
        description="Biography, mission, and the timeline/education entries shown on the About page."
      />

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-6">
          <AboutForm about={about} />
        </TabsContent>
        <TabsContent value="timeline" className="mt-6">
          <TimelineManager items={about?.timeline ?? []} />
        </TabsContent>
        <TabsContent value="education" className="mt-6">
          <EducationManager items={about?.education ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
