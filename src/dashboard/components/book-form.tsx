"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { ImageUploadField } from "@/dashboard/components/image-upload-field";
import { createBookAction, updateBookAction } from "@/actions/admin/book.actions";
import { createBookSchema, type CreateBookInput } from "@/validators/book.validator";
import { isFeatureEnabled } from "@/features/flags";
import type { Book, Media, Seo } from "@/generated/prisma/client";

interface BookFormProps {
  book?: Book & { coverImage: Media | null; seo?: Seo | null };
}

export function BookForm({ book }: BookFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const directBookSales = isFeatureEnabled("directBookSales");

  const form = useForm<CreateBookInput>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: book?.title ?? "",
      slug: book?.slug ?? "",
      excerpt: book?.excerpt ?? "",
      description: book?.description ?? "",
      coverImageId: book?.coverImageId ?? null,
      amazonUrl: book?.amazonUrl ?? "",
      directPurchaseUrl: book?.directPurchaseUrl ?? "",
      published: book?.published ?? false,
      comingSoon: book?.comingSoon ?? false,
      featured: book?.featured ?? false,
      seo: {
        metaTitle: book?.seo?.metaTitle ?? "",
        metaDescription: book?.seo?.metaDescription ?? "",
      },
    },
  });

  function onSubmit(values: CreateBookInput) {
    startTransition(async () => {
      const result = book
        ? await updateBookAction(book.id, values)
        : await createBookAction(values);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/books");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8">
        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="The Great Debate" {...field} />
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
                    <Input placeholder="the-great-debate" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormDescription>Leave blank to generate from the title.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormDescription>Shown on book cards and previews.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={6} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormDescription>The full product-page description.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Cover</h2>
          <div className="mt-4">
            <FormField
              control={form.control}
              name="coverImageId"
              render={({ field }) => (
                <ImageUploadField
                  label="Cover image"
                  folder="BOOK_COVERS"
                  value={
                    field.value
                      ? { id: field.value, url: book?.coverImage?.url ?? "" }
                      : null
                  }
                  onChange={(next) => field.onChange(next?.id ?? null)}
                />
              )}
            />
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Purchase links</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="amazonUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amazon URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://amazon.com/..." {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="directPurchaseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Direct purchase URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Not available yet"
                      disabled={!directBookSales}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    {directBookSales
                      ? "Shown as a direct checkout button."
                      : "Disabled — direct book sales aren't live yet (features.directBookSales)."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Status</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4">
                  <div>
                    <Label htmlFor="published">Published</Label>
                    <p className="text-xs text-muted-foreground">Visible on the live site.</p>
                  </div>
                  <Switch id="published" checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="comingSoon"
              render={({ field }) => (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4">
                  <div>
                    <Label htmlFor="comingSoon">Coming soon</Label>
                    <p className="text-xs text-muted-foreground">Shows a badge, not yet buyable.</p>
                  </div>
                  <Switch id="comingSoon" checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4">
                  <div>
                    <Label htmlFor="featured">Featured</Label>
                    <p className="text-xs text-muted-foreground">Highlighted on the homepage.</p>
                  </div>
                  <Switch id="featured" checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">SEO</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="seo.metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta title</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormDescription>Defaults to the book title if left blank.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seo.metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta description</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormDescription>Defaults to the excerpt if left blank.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="gold" size="lg" disabled={isPending}>
            {isPending ? "Saving…" : book ? "Save changes" : "Create book"}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => router.push("/admin/books")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
