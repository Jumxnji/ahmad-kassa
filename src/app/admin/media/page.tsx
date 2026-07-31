import Link from "next/link";
import { ImageIcon, LayoutGrid, List } from "lucide-react";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { MediaUploadButton } from "@/dashboard/components/media-upload-button";
import { MediaCard } from "@/dashboard/components/media-card";
import { MediaListRow } from "@/dashboard/components/media-list-row";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mediaService } from "@/services/media.service";
import type { $Enums } from "@/generated/prisma/client";

export const metadata = { title: "Media Library" };

const FOLDERS: { value: $Enums.MediaFolder | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "IMAGES", label: "Images" },
  { value: "BOOK_COVERS", label: "Book covers" },
  { value: "PDFS", label: "PDFs" },
  { value: "VIDEOS", label: "Videos" },
];

interface MediaPageProps {
  searchParams: Promise<{ folder?: string; q?: string; view?: string }>;
}

function buildHref(folder: string | undefined, q: string | undefined, view: string) {
  const params = new URLSearchParams();
  if (folder) params.set("folder", folder);
  if (q) params.set("q", q);
  if (view !== "grid") params.set("view", view);
  const qs = params.toString();
  return qs ? `/admin/media?${qs}` : "/admin/media";
}

export default async function AdminMediaPage({ searchParams }: MediaPageProps) {
  const { folder, q, view: rawView } = await searchParams;
  const activeFolder = (folder as $Enums.MediaFolder) || undefined;
  const view = rawView === "list" ? "list" : "grid";

  const media = await mediaService.list({ folder: activeFolder, search: q });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Media Library"
        description="Images and files used across books, pages, and SEO — reusable everywhere."
        actions={<MediaUploadButton folder={activeFolder ?? "IMAGES"} />}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FOLDERS.map((f) => {
            const isActive = (f.value === "ALL" && !folder) || f.value === folder;
            return (
              <Link
                key={f.value}
                href={buildHref(f.value === "ALL" ? undefined : f.value, q, view)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  isActive
                    ? "border-navy-900 bg-navy-900 text-paper-50"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <form action="/admin/media" method="GET" className="flex gap-2">
            {folder && <input type="hidden" name="folder" value={folder} />}
            {view !== "grid" && <input type="hidden" name="view" value={view} />}
            <Input name="q" placeholder="Search filenames…" defaultValue={q} className="w-56" />
            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>

          <div className="inline-flex overflow-hidden rounded-md border border-border">
            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={cn("rounded-none", view === "grid" && "bg-paper-100")}
            >
              <Link href={buildHref(folder, q, "grid")}>
                <LayoutGrid className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              aria-label="List view"
              aria-pressed={view === "list"}
              className={cn("rounded-none border-l border-border", view === "list" && "bg-paper-100")}
            >
              <Link href={buildHref(folder, q, "list")}>
                <List className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {media.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title={q ? `No files match "${q}"` : "No files here yet"}
          description={q ? "Try a different search term." : "Upload images or PDFs to reuse across the site."}
        />
      ) : view === "list" ? (
        <div className="overflow-hidden rounded-lg border border-border">
          {media.map((item) => (
            <MediaListRow key={item.id} media={item} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {media.map((item) => (
            <MediaCard key={item.id} media={item} />
          ))}
        </div>
      )}
    </div>
  );
}
