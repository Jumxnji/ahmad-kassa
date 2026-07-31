"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/shared/container";
import { ImageUploadField } from "@/dashboard/components/image-upload-field";
import { AutosaveIndicator } from "@/dashboard/components/autosave-indicator";
import { useAutosave } from "@/hooks/use-autosave";
import { updateHomepageAction } from "@/actions/admin/homepage.actions";
import { updateHomepageSchema, type UpdateHomepageInput } from "@/validators/homepage.validator";
import { cn } from "@/lib/utils";
import type { Book, HomepageContent, Media, Seo } from "@/generated/prisma/client";

interface HomepageFormProps {
  homepage: (HomepageContent & { heroImage: Media | null; seo: Seo | null }) | null;
  books: Book[];
}

interface LivePreviewValues {
  heroEyebrow?: string;
  heroHeadline?: string;
  heroSubtitle?: string;
  heroPrimaryCtaLabel?: string;
  heroSecondaryCtaLabel?: string;
}

function LivePreviewCard({
  values,
  heroImageUrl,
}: {
  values: LivePreviewValues;
  heroImageUrl: string;
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
          ahmadkassa.com
        </span>
        <span className="ml-auto text-eyebrow text-stone-400">Live preview</span>
      </div>
      <div className="bg-background px-6 py-12 sm:px-10">
        <Container width="narrow" className="px-0 text-center">
          <p className="text-eyebrow">{values.heroEyebrow}</p>
          <h1 className="mx-auto mt-4 max-w-2xl text-3xl leading-[1.1] text-balance sm:text-4xl">
            {values.heroHeadline || "Your headline appears here"}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-balance text-muted-foreground">
            {values.heroSubtitle || "Your subtitle appears here."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <Button variant="gold" tabIndex={-1} className="pointer-events-none">
              {values.heroPrimaryCtaLabel || "Primary"}
            </Button>
            <Button variant="outline" tabIndex={-1} className="pointer-events-none">
              {values.heroSecondaryCtaLabel || "Secondary"}
            </Button>
          </div>
          {heroImageUrl && (
            <div className="relative mx-auto mt-8 aspect-video max-w-md overflow-hidden rounded-lg border border-border">
              <Image src={heroImageUrl} alt="" fill sizes="400px" className="object-cover" />
            </div>
          )}
        </Container>
      </div>
    </Card>
  );
}

export function HomepageForm({ homepage, books }: HomepageFormProps) {
  const [isPending, startTransition] = useTransition();
  const [heroImageUrl, setHeroImageUrl] = useState(homepage?.heroImage?.url ?? "");

  const form = useForm<UpdateHomepageInput>({
    resolver: zodResolver(updateHomepageSchema),
    defaultValues: {
      heroEyebrow: homepage?.heroEyebrow ?? "Islamic Teacher · Author · Khateeb",
      heroHeadline: homepage?.heroHeadline ?? "",
      heroSubtitle: homepage?.heroSubtitle ?? "",
      heroPrimaryCtaLabel: homepage?.heroPrimaryCtaLabel ?? "Explore Books",
      heroPrimaryCtaHref: homepage?.heroPrimaryCtaHref ?? "/books",
      heroSecondaryCtaLabel: homepage?.heroSecondaryCtaLabel ?? "Browse Articles",
      heroSecondaryCtaHref: homepage?.heroSecondaryCtaHref ?? "/articles",
      heroImageId: homepage?.heroImageId ?? null,
      aboutPreviewText: homepage?.aboutPreviewText ?? "",
      featuredBookId: homepage?.featuredBookId ?? null,
      newsletterHeadline: homepage?.newsletterHeadline ?? "Stay connected, without the noise",
      newsletterText: homepage?.newsletterText ?? "",
      status: homepage?.status ?? "PUBLISHED",
      seo: {
        metaTitle: homepage?.seo?.metaTitle ?? "",
        metaDescription: homepage?.seo?.metaDescription ?? "",
      },
    },
  });

  const watched = useWatch({ control: form.control });
  const status = watched.status ?? "PUBLISHED";

  const autosaveStatus = useAutosave({
    value: watched,
    enabled: form.formState.isDirty,
    onSave: async (values) => {
      const result = await updateHomepageAction(values);
      if (!result.success) toast.error(result.message);
      return { success: result.success };
    },
  });

  function onSubmit(values: UpdateHomepageInput) {
    startTransition(async () => {
      const result = await updateHomepageAction(values);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  function setStatus(next: "DRAFT" | "PUBLISHED") {
    form.setValue("status", next, { shouldDirty: true });
    startTransition(async () => {
      const result = await updateHomepageAction({ ...form.getValues(), status: next });
      if (result.success) {
        toast.success(next === "PUBLISHED" ? "Homepage published." : "Moved to draft.");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex overflow-hidden rounded-full border border-border p-0.5">
            <button
              type="button"
              onClick={() => setStatus("DRAFT")}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                status === "DRAFT"
                  ? "bg-paper-100 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Draft
            </button>
            <button
              type="button"
              onClick={() => setStatus("PUBLISHED")}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                status === "PUBLISHED"
                  ? "bg-success-100 text-success-500"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Published
            </button>
          </div>
          <AutosaveIndicator status={autosaveStatus} />
        </div>

        <LivePreviewCard values={watched} heroImageUrl={heroImageUrl} />

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Hero</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="heroEyebrow"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Eyebrow</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroHeadline"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroSubtitle"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroPrimaryCtaLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary button label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroPrimaryCtaHref"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary button link</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroSecondaryCtaLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary button label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroSecondaryCtaHref"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary button link</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-6" />
          <FormField
            control={form.control}
            name="heroImageId"
            render={({ field }) => (
              <ImageUploadField
                label="Hero image (optional)"
                folder="IMAGES"
                value={field.value ? { id: field.value, url: heroImageUrl } : null}
                onChange={(next) => {
                  field.onChange(next?.id ?? null);
                  setHeroImageUrl(next?.url ?? "");
                }}
              />
            )}
          />
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">About preview</h2>
          <div className="mt-4">
            <FormField
              control={form.control}
              name="aboutPreviewText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preview text</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormDescription>Shown in the About Preview section on the homepage.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Featured book</h2>
          <div className="mt-4">
            <FormField
              control={form.control}
              name="featuredBookId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                    value={field.value ?? "none"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full sm:w-80">
                        <SelectValue placeholder="Choose a book" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {books.map((book) => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Newsletter section</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="newsletterHeadline"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newsletterText"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Supporting text</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Button type="submit" variant="gold" size="lg" disabled={isPending}>
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
