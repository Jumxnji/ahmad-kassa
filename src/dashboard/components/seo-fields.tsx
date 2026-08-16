"use client";

import { useWatch, type Control, type FieldValues, type Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

export const META_TITLE_MAX = 60;
export const META_DESCRIPTION_MAX = 155;

/** Exported for forms with a differently-shaped Seo object (e.g. the site-wide defaults form, whose fields aren't nested under `seo.*`) that still want the same length-guidance treatment. */
export function CharCount({ value, max }: { value: string; max: number }) {
  const length = value.length;
  return (
    <span className={cn("text-xs tabular-nums", length > max ? "text-destructive" : "text-muted-foreground")}>
      {length} / {max}
    </span>
  );
}

interface SeoFieldsProps<T extends FieldValues> {
  control: Control<T>;
  /** Field path this SEO object is nested under — every content schema embeds it the same way (see src/schemas/seo.schema.ts). */
  prefix?: string;
  titleDefaultHint?: string;
  descriptionDefaultHint?: string;
  showCanonical?: boolean;
  showKeywords?: boolean;
}

/**
 * One reusable "Search & sharing" card — meta title/description (with
 * length guidance), canonical URL, keywords, and a per-item noindex
 * toggle. Used identically by the Book editor, Homepage editor, About
 * editor, and the site-wide SEO defaults form, so title/description
 * length guidance and the noindex toggle only need to exist once.
 */
export function SeoFields<T extends FieldValues>({
  control,
  prefix = "seo",
  titleDefaultHint,
  descriptionDefaultHint,
  showCanonical = true,
  showKeywords = true,
}: SeoFieldsProps<T>) {
  const path = (suffix: string) => `${prefix}.${suffix}` as Path<T>;
  const metaTitle = (useWatch({ control, name: path("metaTitle") }) as string | undefined) ?? "";
  const metaDescription = (useWatch({ control, name: path("metaDescription") }) as string | undefined) ?? "";

  return (
    <Card className="border-none p-6 shadow-none ring-1 ring-border">
      <h2 className="text-sm font-medium text-foreground">Search &amp; sharing</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <FormField
          control={control}
          name={path("metaTitle")}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Meta title</FormLabel>
                <CharCount value={metaTitle} max={META_TITLE_MAX} />
              </div>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              {titleDefaultHint && <FormDescription>{titleDefaultHint}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={path("metaDescription")}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Meta description</FormLabel>
                <CharCount value={metaDescription} max={META_DESCRIPTION_MAX} />
              </div>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              {descriptionDefaultHint && <FormDescription>{descriptionDefaultHint}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        {showCanonical && (
          <FormField
            control={control}
            name={path("canonicalUrl")}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Canonical URL</FormLabel>
                <FormControl>
                  <Input placeholder="Defaults to this page's own URL" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {showKeywords && (
          <FormField
            control={control}
            name={path("keywords")}
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
        )}
      </div>
      <FormField
        control={control}
        name={path("noindex")}
        render={({ field }) => (
          <FormItem className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
            <div className="space-y-0.5">
              <FormLabel className="text-sm">Hide from search engines</FormLabel>
              <FormDescription>
                Adds a noindex directive — use for drafts or pages not ready for public discovery.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </Card>
  );
}
