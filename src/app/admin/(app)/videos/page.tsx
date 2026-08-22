import Image from "next/image";
import Link from "next/link";
import { Plus, Video as VideoIcon } from "lucide-react";
import { DashboardPageHeader } from "@/dashboard/components/page-header";
import { DataTable, type DataTableColumn } from "@/dashboard/components/data-table";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { VideoRowActions } from "@/dashboard/components/video-row-actions";
import { TableSearchForm } from "@/dashboard/components/table-toolbar";
import { PaginationControls } from "@/dashboard/components/pagination-controls";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { videoService } from "@/services/video.service";
import { formatDate } from "@/lib/format";
import { buildListHref, pageCount, parseListQuery, type RawListSearchParams } from "@/lib/list-query";
import { VIDEO_STATUS_LABEL, VIDEO_STATUS_TONE } from "@/dashboard/videos-constants";

type VideoRow = Awaited<ReturnType<typeof videoService.listPaged>>["rows"][number];

export const metadata = { title: "Videos" };

const BASE_PATH = "/admin/videos";

interface VideosPageProps {
  searchParams: Promise<RawListSearchParams>;
}

export default async function AdminVideosPage({ searchParams }: VideosPageProps) {
  const query = parseListQuery(await searchParams, "createdAt");
  const { rows: videos, total } = await videoService.listPaged(query);

  const columns: DataTableColumn<VideoRow>[] = [
    {
      key: "thumbnail",
      header: "",
      className: "w-20",
      cell: (video) => (
        <div className="relative aspect-video w-16 overflow-hidden rounded-md bg-navy-900 ring-1 ring-black/10">
          <Image src={video.thumbnailUrl} alt="" fill sizes="64px" className="object-cover" />
        </div>
      ),
    },
    {
      key: "title",
      header: "Title",
      sortKey: "title",
      cell: (video) => (
        <div>
          <p className="font-medium text-foreground">{video.title}</p>
          <p className="text-xs text-muted-foreground">/{video.slug}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (video) => <StatusBadge label={VIDEO_STATUS_LABEL[video.status]} tone={VIDEO_STATUS_TONE[video.status]} />,
    },
    {
      key: "publishedAt",
      header: "Published",
      sortKey: "publishedAt",
      cell: (video) => (
        <span className="text-sm text-muted-foreground">
          {video.publishedAt ? formatDate(video.publishedAt.toISOString()) : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-32",
      cell: (video) => (
        <VideoRowActions id={video.id} title={video.title} youtubeId={video.youtubeId} status={video.status} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Videos"
        description="Khutbahs and other videos — the source for the homepage's Latest Khutbah section."
        actions={
          <Button asChild variant="gold">
            <Link href="/admin/videos/new">
              <Plus data-icon="inline-start" />
              New video
            </Link>
          </Button>
        }
      />

      <TableSearchForm
        action={BASE_PATH}
        placeholder="Search videos…"
        defaultValue={query.q}
        preserve={{ sort: query.sort, dir: query.dir }}
      />

      {videos.length === 0 ? (
        <EmptyState
          icon={VideoIcon}
          title={query.q ? `No videos match "${query.q}"` : "No videos yet"}
          description={query.q ? "Try a different search term." : "Add a YouTube video to get started."}
          action={
            !query.q && (
              <Button asChild variant="gold">
                <Link href="/admin/videos/new">New video</Link>
              </Button>
            )
          }
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={videos}
            getRowKey={(video) => video.id}
            sort={{ key: query.sort, dir: query.dir }}
            buildSortHref={(key, dir) => buildListHref(BASE_PATH, query, { sort: key, dir, page: 1 })}
          />
          <PaginationControls
            page={query.page}
            pageCount={pageCount(total, query.pageSize)}
            total={total}
            itemLabel="video"
            buildHref={(page) => buildListHref(BASE_PATH, query, { page })}
          />
        </>
      )}
    </div>
  );
}
