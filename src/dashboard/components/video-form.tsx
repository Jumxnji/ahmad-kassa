"use client";

import { useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { AutosaveIndicator } from "@/dashboard/components/autosave-indicator";
import { useAutosave } from "@/hooks/use-autosave";
import { createVideoAction, updateVideoAction } from "@/actions/admin/video.actions";
import { videoStatusValues } from "@/schemas/video.schema";
import { extractYoutubeId, youtubeThumbnailUrl } from "@/lib/youtube";
import { formatDate } from "@/lib/format";
import type { CreateVideoInput } from "@/validators/video.validator";
import type { Video } from "@/generated/prisma/client";

const STATUS_OPTIONS: { value: (typeof videoStatusValues)[number]; label: string; hint: string }[] = [
  { value: "DRAFT", label: "Draft", hint: "Not visible anywhere on the public site." },
  { value: "PUBLISHED", label: "Published", hint: "Eligible to be selected as a homepage khutbah." },
];

const videoFormSchema = z.object({
  youtubeUrl: z.string().min(1, "Paste a YouTube URL or video ID.").refine((value) => extractYoutubeId(value) !== null, {
    message: "Enter a valid YouTube URL (youtube.com or youtu.be) or an 11-character video ID.",
  }),
  title: z.string().min(2).max(200),
  slug: z.string().max(200).optional(),
  publishedAt: z.date().optional().nullable(),
  durationMinutes: z.number().int().min(0).max(600).optional().nullable(),
  source: z.string().max(120).optional().nullable(),
  category: z.string().max(60).optional().nullable(),
  status: z.enum(videoStatusValues),
});
type VideoFormValues = z.infer<typeof videoFormSchema>;

function dateInputValue(value: unknown): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value as string);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function toActionPayload(values: VideoFormValues): CreateVideoInput {
  const youtubeId = extractYoutubeId(values.youtubeUrl)!;
  return {
    title: values.title,
    slug: values.slug || undefined,
    youtubeId,
    thumbnailUrl: youtubeThumbnailUrl(youtubeId),
    publishedAt: values.publishedAt ?? null,
    durationMinutes: values.durationMinutes ?? null,
    source: values.source || null,
    category: values.category || null,
    status: values.status,
  };
}

export function VideoForm({ video }: { video?: Video }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      youtubeUrl: video?.youtubeId ?? "",
      title: video?.title ?? "",
      slug: video?.slug ?? "",
      publishedAt: video?.publishedAt ?? undefined,
      durationMinutes: video?.durationMinutes ?? undefined,
      source: video?.source ?? "",
      category: video?.category ?? "",
      status: video?.status ?? "DRAFT",
    },
  });

  const watched = useWatch({ control: form.control });
  const previewId = extractYoutubeId(watched.youtubeUrl ?? "") ?? "";

  const autosaveStatus = useAutosave({
    value: watched,
    enabled: Boolean(video) && form.formState.isDirty,
    onSave: async (values) => {
      if (!video) return { success: true };
      const parsed = videoFormSchema.safeParse(values);
      if (!parsed.success) return { success: false };
      const result = await updateVideoAction(video.id, toActionPayload(parsed.data));
      if (!result.success) toast.error(result.message);
      return { success: result.success };
    },
  });

  function onSubmit(values: VideoFormValues) {
    startTransition(async () => {
      const payload = toActionPayload(values);
      const result = video
        ? await updateVideoAction(video.id, payload)
        : await createVideoAction(payload);

      if (result.success) {
        toast.success(result.message);
        if (!video) router.push(`/admin/videos/${result.data.id}`);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleCancel() {
    if (form.formState.isDirty && !window.confirm("Discard unsaved changes?")) return;
    router.push("/admin/videos");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {video ? `Last updated ${formatDate(video.updatedAt.toISOString())}` : "Not yet saved"}
          </p>
          {video && <AutosaveIndicator status={autosaveStatus} />}
        </div>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">YouTube source</h2>
          <div className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube URL or video ID</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.youtube.com/watch?v=…" {...field} />
                  </FormControl>
                  <FormDescription>
                    Accepts a full watch/share link (youtube.com or youtu.be) or a bare 11-character video ID.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {previewId && (
              <div className="flex items-center gap-4">
                <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-md bg-navy-900 ring-1 ring-black/10">
                  <Image
                    src={youtubeThumbnailUrl(previewId)}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Video ID <span className="font-mono text-foreground">{previewId}</span>
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Details</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="auto-generated-from-title" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormDescription>Leave blank to generate from the title.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publishedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Published date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={dateInputValue(field.value)}
                      onChange={(event) =>
                        field.onChange(event.target.value ? new Date(event.target.value) : null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(event.target.value === "" ? null : Number(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input placeholder="Masjid Al-Noor" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Weekly Khutbah" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full sm:w-72">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {STATUS_OPTIONS.find((o) => o.value === field.value)?.hint}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="gold" size="lg" disabled={isPending}>
            {isPending ? "Saving…" : video ? "Save changes" : "Create video"}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
