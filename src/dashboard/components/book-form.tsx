"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RichTextEditor } from "@/dashboard/components/rich-text-editor";
import { TagsInput } from "@/dashboard/components/tags-input";
import { MediaPickerField, MediaGalleryField, type MediaPickerItem } from "@/dashboard/components/media-picker";
import { AutosaveIndicator } from "@/dashboard/components/autosave-indicator";
import { useAutosave } from "@/hooks/use-autosave";
import { createBookAction, updateBookAction } from "@/actions/admin/book.actions";
import { updateMediaDetailsAction } from "@/actions/admin/media.actions";
import { createBookSchema, type CreateBookInput } from "@/validators/book.validator";
import { isFeatureEnabled } from "@/features/flags";
import { formatDate } from "@/lib/format";
import type { Book, Media, Seo } from "@/generated/prisma/client";

interface BookFormProps {
  book?: Book & { coverImage: Media | null; gallery: Media[]; seo?: Seo | null };
}

const STATUS_OPTIONS: { value: CreateBookInput["status"]; label: string; hint: string }[] = [
  { value: "DRAFT", label: "Draft", hint: "Not visible anywhere on the public site." },
  { value: "PUBLISHED", label: "Published", hint: "Live on the site, fully buyable." },
  { value: "COMING_SOON", label: "Coming soon", hint: "Visible with a badge, not yet buyable." },
  { value: "ARCHIVED", label: "Archived", hint: "Was published, now hidden — kept for records." },
];

function dateInputValue(value: unknown): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value as string);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function toItem(media: Media | null | undefined): MediaPickerItem | null {
  if (!media) return null;
  return { id: media.id, url: media.url, thumbnailUrl: media.thumbnailUrl, filename: media.filename };
}

function PreviewCard({
  values,
  coverUrl,
}: {
  values: Pick<CreateBookInput, "title" | "excerpt" | "status" | "featured" | "category">;
  coverUrl: string | null;
}) {
  return (
    <Card className="overflow-hidden border-none p-0 shadow-none ring-1 ring-border">
      <div className="flex items-center gap-2 border-b border-border bg-paper-100/60 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-stone-300" />
          <span className="size-2 rounded-full bg-stone-300" />
          <span className="size-2 rounded-full bg-stone-300" />
        </span>
        <span className="ml-2 rounded-full bg-background px-3 py-1 text-xs text-muted-foreground ring-1 ring-border">
          ahmadkassa.com/books/…
        </span>
        <span className="ml-auto text-eyebrow text-stone-400">Live preview</span>
      </div>
      <div className="grid gap-8 bg-background px-6 py-10 sm:grid-cols-[minmax(0,0.4fr)_1fr] sm:px-10">
        <div className="relative mx-auto aspect-2/3 w-full max-w-40 overflow-hidden rounded-md bg-navy-900 ring-1 ring-black/10">
          {coverUrl ? (
            <Image src={coverUrl} alt="" fill sizes="200px" className="object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center font-display text-4xl italic text-gold-300/90">
              {values.title?.trim().charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>
        <div>
          <div className="flex flex-wrap gap-1.5">
            {values.category && (
              <Badge variant="secondary" className="border-none bg-gold-100 text-gold-700">
                {values.category}
              </Badge>
            )}
            {values.status === "COMING_SOON" && (
              <Badge className="border-none bg-navy-900 text-gold-300">Coming soon</Badge>
            )}
            {values.featured && (
              <Badge variant="secondary" className="border-none bg-paper-100 text-stone-600">
                Featured
              </Badge>
            )}
          </div>
          <h1 className="mt-3 font-display text-3xl leading-tight text-balance">
            {values.title || "Your book's title"}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            {values.excerpt || "Your short description will appear here."}
          </p>
          <Button variant="gold" size="lg" className="mt-6 pointer-events-none" tabIndex={-1}>
            Buy the book
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function BookForm({ book }: BookFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const directBookSales = isFeatureEnabled("directBookSales");

  const [coverItem, setCoverItem] = useState<MediaPickerItem | null>(toItem(book?.coverImage));
  const [coverAlt, setCoverAlt] = useState(book?.coverImage?.altText ?? "");
  const [galleryItems, setGalleryItems] = useState<MediaPickerItem[]>(
    (book?.gallery ?? []).map((m) => toItem(m)!)
  );

  const form = useForm({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: book?.title ?? "",
      slug: book?.slug ?? "",
      excerpt: book?.excerpt ?? "",
      description: book?.description ?? "",
      authorName: book?.authorName ?? "Ahmad Mohamed Kassa",
      publicationDate: book?.publicationDate ?? undefined,
      isbn: book?.isbn ?? "",
      language: book?.language ?? "English",
      category: book?.category ?? "",
      tags: book?.tags ?? [],
      coverImageId: book?.coverImageId ?? null,
      galleryIds: (book?.gallery ?? []).map((m) => m.id),
      amazonUrl: book?.amazonUrl ?? "",
      directPurchaseUrl: book?.directPurchaseUrl ?? "",
      signedCopyAvailable: book?.signedCopyAvailable ?? false,
      ebookUrl: book?.ebookUrl ?? "",
      audiobookUrl: book?.audiobookUrl ?? "",
      status: book?.status ?? "DRAFT",
      featured: book?.featured ?? false,
      seo: {
        metaTitle: book?.seo?.metaTitle ?? "",
        metaDescription: book?.seo?.metaDescription ?? "",
        canonicalUrl: book?.seo?.canonicalUrl ?? "",
        keywords: book?.seo?.keywords ?? "",
      },
    },
  });

  // Warn on tab close/refresh with unsaved work — the in-app "Cancel"
  // button below handles the app-navigation case with its own confirm.
  useEffect(() => {
    function handler(event: BeforeUnloadEvent) {
      if (!form.formState.isDirty) return;
      event.preventDefault();
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [form.formState.isDirty]);

  const watched = useWatch({ control: form.control });

  // Autosave only applies to an existing book — a new book has nothing
  // to save against until the first explicit "Create book" submit.
  const autosaveStatus = useAutosave({
    value: watched,
    enabled: Boolean(book) && form.formState.isDirty,
    onSave: async (values) => {
      if (!book) return { success: true };
      const result = await updateBookAction(book.id, values as CreateBookInput);
      if (!result.success) toast.error(result.message);
      return { success: result.success };
    },
  });

  function handleCoverChange(next: MediaPickerItem | null) {
    setCoverItem(next);
    setCoverAlt("");
    form.setValue("coverImageId", next?.id ?? null, { shouldDirty: true });
  }

  function handleCoverAltBlur() {
    if (!coverItem) return;
    startTransition(async () => {
      await updateMediaDetailsAction(coverItem.id, { filename: coverItem.filename, altText: coverAlt });
    });
  }

  function handleGalleryChange(next: MediaPickerItem[]) {
    setGalleryItems(next);
    form.setValue(
      "galleryIds",
      next.map((item) => item.id),
      { shouldDirty: true }
    );
  }

  function onSubmit(values: CreateBookInput) {
    startTransition(async () => {
      const result = book
        ? await updateBookAction(book.id, values)
        : await createBookAction(values);

      if (result.success) {
        toast.success(result.message);
        if (!book) router.push(`/admin/books/${result.data.id}`);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleCancel() {
    if (form.formState.isDirty && !window.confirm("Discard unsaved changes?")) return;
    router.push("/admin/books");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {book ? `Last updated ${formatDate(book.updatedAt.toISOString())}` : "Not yet saved"}
          </p>
          {book && <AutosaveIndicator status={autosaveStatus} />}
        </div>

        <Tabs defaultValue="general">
          <TabsList variant="line" className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="publishing">Publishing</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="purchase">Purchase options</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6 space-y-6">
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
                      <FormLabel>Short description</FormLabel>
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
                      <FormLabel>Full description</FormLabel>
                      <FormControl>
                        <RichTextEditor value={field.value ?? ""} onChange={field.onChange} />
                      </FormControl>
                      <FormDescription>The full product-page description.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            <Card className="border-none p-6 shadow-none ring-1 ring-border">
              <h2 className="text-sm font-medium text-foreground">Details</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publicationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publication date</FormLabel>
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
                  name="isbn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISBN</FormLabel>
                      <FormControl>
                        <Input placeholder="978-0-000000-0-0" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormDescription>Optional.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input placeholder="Aqeedah, Fiqh, Seerah…" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <TagsInput value={field.value ?? []} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="publishing" className="mt-6">
            <Card className="border-none p-6 shadow-none ring-1 ring-border">
              <h2 className="text-sm font-medium text-foreground">Status</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
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
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4 sm:col-span-2">
                      <div>
                        <Label htmlFor="featured">Featured</Label>
                        <p className="text-xs text-muted-foreground">
                          Eligible to lead the homepage&rsquo;s Featured Book section.
                        </p>
                      </div>
                      <Switch id="featured" checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="mt-6 space-y-6">
            <Card className="border-none p-6 shadow-none ring-1 ring-border">
              <h2 className="text-sm font-medium text-foreground">Cover</h2>
              <div className="mt-4 space-y-4">
                <MediaPickerField
                  label="Cover image"
                  folder="BOOK_COVERS"
                  value={coverItem}
                  onChange={handleCoverChange}
                />
                {coverItem && (
                  <div className="max-w-sm">
                    <Label htmlFor="cover-alt" className="text-xs">
                      Alt text
                    </Label>
                    <Input
                      id="cover-alt"
                      value={coverAlt}
                      onChange={(event) => setCoverAlt(event.target.value)}
                      onBlur={handleCoverAltBlur}
                      placeholder="Describe the cover for screen readers"
                      className="mt-1"
                    />
                  </div>
                )}
                {!coverItem && (
                  <p className="text-xs text-muted-foreground">
                    No cover uploaded yet — the public site shows an on-brand placeholder
                    until one is added here.
                  </p>
                )}
              </div>
            </Card>

            <Card className="border-none p-6 shadow-none ring-1 ring-border">
              <h2 className="text-sm font-medium text-foreground">Gallery</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Inside pages, back cover, promotional graphics — shown on the book&rsquo;s detail page.
              </p>
              <div className="mt-4">
                <MediaGalleryField
                  label=""
                  folder="GALLERY"
                  value={galleryItems}
                  onChange={handleGalleryChange}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="purchase" className="mt-6">
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
                        <Input placeholder="https://amazon.co.uk/..." {...field} value={field.value ?? ""} />
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
                      <FormLabel>Direct website purchase</FormLabel>
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
                <FormField
                  control={form.control}
                  name="ebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>eBook</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Not available yet"
                          disabled={!directBookSales}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        {directBookSales ? "Direct ebook purchase/download link." : "Disabled for now."}
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="audiobookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audiobook</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Not available yet"
                          disabled={!directBookSales}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        {directBookSales ? "Direct audiobook purchase link." : "Disabled for now."}
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="signedCopyAvailable"
                  render={({ field }) => (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4 sm:col-span-2">
                      <div>
                        <Label htmlFor="signedCopyAvailable">Signed copies available</Label>
                        <p className="text-xs text-muted-foreground">
                          {directBookSales
                            ? "Shows a \"signed edition\" option at checkout."
                            : "Disabled — direct book sales aren't live yet."}
                        </p>
                      </div>
                      <Switch
                        id="signedCopyAvailable"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!directBookSales}
                      />
                    </div>
                  )}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="mt-6">
            <Card className="border-none p-6 shadow-none ring-1 ring-border">
              <h2 className="text-sm font-medium text-foreground">Search &amp; sharing</h2>
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
                      <FormDescription>Defaults to the short description if left blank.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seo.canonicalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Defaults to the book's own URL" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seo.keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="mt-6 rounded-lg bg-paper-100/60 p-4 text-xs leading-relaxed text-muted-foreground">
                Structured data (schema.org <code>Book</code> JSON-LD) is generated automatically
                from this book&rsquo;s details — title, author, ISBN, format, and availability — no
                separate field to maintain.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <PreviewCard
              values={{
                title: watched.title ?? "",
                excerpt: watched.excerpt ?? "",
                status: watched.status ?? "DRAFT",
                featured: watched.featured ?? false,
                category: watched.category,
              }}
              coverUrl={coverItem?.url ?? null}
            />
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="gold" size="lg" disabled={isPending}>
            {isPending ? "Saving…" : book ? "Save changes" : "Create book"}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
