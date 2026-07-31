"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Info, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ConfirmDialog } from "@/dashboard/components/confirm-dialog";
import {
  updateMediaDetailsAction,
  deleteMediaAction,
  getMediaUsageCountAction,
} from "@/actions/admin/media.actions";
import { updateMediaDetailsSchema, type UpdateMediaDetailsInput } from "@/validators/media.validator";
import { formatBytes, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Media } from "@/generated/prisma/client";

type MediaWithUploader = Media & { uploadedBy: { id: string; name: string } | null };

function DetailsDialog({ media }: { media: MediaWithUploader }) {
  const [open, setOpen] = useState(false);
  const [usageCount, setUsageCount] = useState<number | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdateMediaDetailsInput>({
    resolver: zodResolver(updateMediaDetailsSchema),
    defaultValues: { filename: media.filename, altText: media.altText ?? "" },
  });

  useEffect(() => {
    if (!open) return;
    getMediaUsageCountAction(media.id).then((result) => {
      if (result.success) setUsageCount(result.data.count);
    });
  }, [open, media.id]);

  function onSubmit(values: UpdateMediaDetailsInput) {
    startTransition(async () => {
      const result = await updateMediaDetailsAction(media.id, values);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Details for ${media.filename}`}>
          <Info className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>File details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormField
              control={form.control}
              name="filename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filename</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="altText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alt text</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe this image for screen readers" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg bg-paper-100/60 p-4 text-xs">
              {media.width && media.height && (
                <>
                  <dt className="text-muted-foreground">Dimensions</dt>
                  <dd className="text-right font-medium text-foreground">
                    {media.width} × {media.height}px
                  </dd>
                </>
              )}
              <dt className="text-muted-foreground">Size</dt>
              <dd className="text-right font-medium text-foreground">{formatBytes(media.size)}</dd>
              <dt className="text-muted-foreground">Uploaded</dt>
              <dd className="text-right font-medium text-foreground">
                {formatDate(media.createdAt.toISOString())}
              </dd>
              <dt className="text-muted-foreground">Uploaded by</dt>
              <dd className="text-right font-medium text-foreground">
                {media.uploadedBy?.name ?? "Unknown"}
              </dd>
              <dt className="text-muted-foreground">Used</dt>
              <dd className="text-right font-medium text-foreground">
                {usageCount === null ? (
                  <Loader2 className="ml-auto size-3 animate-spin" />
                ) : (
                  `${usageCount} ${usageCount === 1 ? "place" : "places"}`
                )}
              </dd>
            </dl>
            <DialogFooter>
              <Button type="submit" variant="gold" disabled={isPending}>
                {isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function MediaActionsMenu({ media, className }: { media: MediaWithUploader; className?: string }) {
  const router = useRouter();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <DetailsDialog media={media} />
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label={`Delete ${media.filename}`}>
            <Trash2 className="size-3.5" />
          </Button>
        }
        title={`Delete "${media.filename}"?`}
        description="This can't be undone. Remove it from anything using it first."
        onConfirm={async () => {
          const result = await deleteMediaAction(media.id);
          if (result.success) {
            toast.success(result.message);
            router.refresh();
          } else {
            toast.error(result.message);
          }
        }}
      />
    </div>
  );
}
