"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
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
import { CharCount, META_TITLE_MAX, META_DESCRIPTION_MAX } from "@/dashboard/components/seo-fields";
import { updateDefaultSeoAction } from "@/actions/admin/seo.actions";
import { seoSchema, type SeoInput } from "@/schemas/seo.schema";
import type { Media, Seo } from "@/generated/prisma/client";

interface SeoFormProps {
  seo: (Seo & { ogImage: Media | null; twitterImage: Media | null }) | null;
}

export function SeoForm({ seo }: SeoFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<SeoInput>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      metaTitle: seo?.metaTitle ?? "",
      metaDescription: seo?.metaDescription ?? "",
      ogTitle: seo?.ogTitle ?? "",
      ogDescription: seo?.ogDescription ?? "",
      ogImageId: seo?.ogImageId ?? null,
      twitterCard: seo?.twitterCard ?? "summary_large_image",
      twitterImageId: seo?.twitterImageId ?? null,
      canonicalUrl: seo?.canonicalUrl ?? "",
      keywords: seo?.keywords ?? "",
      noindex: seo?.noindex ?? false,
    },
  });

  const metaTitle = useWatch({ control: form.control, name: "metaTitle" }) ?? "";
  const metaDescription = useWatch({ control: form.control, name: "metaDescription" }) ?? "";

  function onSubmit(values: SeoInput) {
    startTransition(async () => {
      const result = await updateDefaultSeoAction(values);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8">
        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Meta tags</h2>
          <div className="mt-4 space-y-6">
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Default meta title</FormLabel>
                    <CharCount value={metaTitle} max={META_TITLE_MAX} />
                  </div>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Default meta description</FormLabel>
                    <CharCount value={metaDescription} max={META_DESCRIPTION_MAX} />
                  </div>
                  <FormControl>
                    <Textarea rows={3} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Input placeholder="islamic teacher, ruqyah, khateeb" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated. Modern search engines weigh these lightly, if at all.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canonicalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Canonical URL override</FormLabel>
                  <FormControl>
                    <Input placeholder="https://ahmadkassa.com" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormDescription>Leave blank to use each page&rsquo;s own URL.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Social sharing</h2>
          <div className="mt-4 space-y-6">
            <FormField
              control={form.control}
              name="ogTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OpenGraph title</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ogDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OpenGraph description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ogImageId"
              render={({ field }) => (
                <ImageUploadField
                  label="OpenGraph image"
                  folder="IMAGES"
                  value={field.value ? { id: field.value, url: seo?.ogImage?.url ?? "" } : null}
                  onChange={(next) => field.onChange(next?.id ?? null)}
                />
              )}
            />
            <FormField
              control={form.control}
              name="twitterCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter card type</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitterImageId"
              render={({ field }) => (
                <ImageUploadField
                  label="Twitter image"
                  folder="IMAGES"
                  value={field.value ? { id: field.value, url: seo?.twitterImage?.url ?? "" } : null}
                  onChange={(next) => field.onChange(next?.id ?? null)}
                />
              )}
            />
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Indexing</h2>
          <div className="mt-4">
            <FormField
              control={form.control}
              name="noindex"
              render={({ field }) => (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-4">
                  <div>
                    <Label htmlFor="noindex">Discourage search engines site-wide</Label>
                    <p className="text-xs text-muted-foreground">
                      Adds a blanket disallow to robots.txt. Use only while staging.
                    </p>
                  </div>
                  <Switch id="noindex" checked={field.value ?? false} onCheckedChange={field.onChange} />
                </div>
              )}
            />
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Sitemap &amp; robots</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Generated automatically from the site&rsquo;s routes — not hand-edited.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/sitemap.xml" target="_blank">
                sitemap.xml <ExternalLink className="size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/robots.txt" target="_blank">
                robots.txt <ExternalLink className="size-3.5" />
              </Link>
            </Button>
          </div>
        </Card>

        <Button type="submit" variant="gold" size="lg" disabled={isPending}>
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
