"use client";

import { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { ImageUploadField } from "@/dashboard/components/image-upload-field";
import { updateSiteSettingsAction } from "@/actions/admin/site-settings.actions";
import {
  updateSiteSettingsSchema,
  type UpdateSiteSettingsInput,
} from "@/validators/site-settings.validator";
import type { Media, SiteSettings } from "@/generated/prisma/client";

const COLOR_FIELDS = [
  { key: "primary", label: "Primary (navy)" },
  { key: "accent", label: "Accent (gold)" },
  { key: "background", label: "Background" },
  { key: "text", label: "Text" },
  { key: "muted", label: "Muted" },
] as const;

interface SiteSettingsFormProps {
  settings: (SiteSettings & { logo: Media | null }) | null;
}

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  const socialLinks = (settings?.socialLinks as Record<string, string>) ?? {};
  const brandColors = (settings?.brandColors as Record<string, string>) ?? {};
  const analyticsIds = (settings?.analyticsIds as Record<string, string>) ?? {};
  const navigation = (settings?.navigation as { label: string; href: string }[]) ?? [];

  const form = useForm<UpdateSiteSettingsInput>({
    resolver: zodResolver(updateSiteSettingsSchema),
    defaultValues: {
      websiteName: settings?.websiteName ?? "Ahmad Mohamed Kassa",
      domain: settings?.domain ?? "https://ahmadkassa.com",
      contactEmail: settings?.contactEmail ?? "",
      supportEmail: settings?.supportEmail ?? "",
      footerText: settings?.footerText ?? "",
      logoId: settings?.logoId ?? null,
      socialLinks: {
        youtube: socialLinks.youtube ?? "",
        instagram: socialLinks.instagram ?? "",
        tiktok: socialLinks.tiktok ?? "",
      },
      brandColors: {
        primary: brandColors.primary ?? "#0B1F36",
        accent: brandColors.accent ?? "#C6A15B",
        background: brandColors.background ?? "#FAFAF8",
        text: brandColors.text ?? "#111111",
        muted: brandColors.muted ?? "#6B7280",
      },
      analyticsIds: {
        googleAnalyticsId: analyticsIds.googleAnalyticsId ?? "",
        metaPixelId: analyticsIds.metaPixelId ?? "",
      },
      navigation,
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "navigation" });

  function onSubmit(values: UpdateSiteSettingsInput) {
    startTransition(async () => {
      const result = await updateSiteSettingsAction(values);
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
          <h2 className="text-sm font-medium text-foreground">General</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="websiteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supportEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="footerText"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Footer tagline</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-6">
            <FormField
              control={form.control}
              name="logoId"
              render={({ field }) => (
                <ImageUploadField
                  label="Logo"
                  folder="IMAGES"
                  value={field.value ? { id: field.value, url: settings?.logo?.url ?? "" } : null}
                  onChange={(next) => field.onChange(next?.id ?? null)}
                />
              )}
            />
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Social links</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="socialLinks.youtube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialLinks.instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input placeholder="https://instagram.com/…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialLinks.tiktok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TikTok</FormLabel>
                  <FormControl>
                    <Input placeholder="https://tiktok.com/…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground">Navigation</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ label: "", href: "" })}
            >
              <Plus data-icon="inline-start" />
              Add link
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-end gap-3">
                <FormField
                  control={form.control}
                  name={`navigation.${index}.label`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className={index === 0 ? "" : "sr-only"}>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="About" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`navigation.${index}.href`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className={index === 0 ? "" : "sr-only"}>Link</FormLabel>
                      <FormControl>
                        <Input placeholder="/about" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove link"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground">No custom links yet.</p>
            )}
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Brand colours</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {COLOR_FIELDS.map(({ key, label }) => (
              <FormField
                key={key}
                control={form.control}
                name={`brandColors.${key}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input type="color" className="h-9 w-12 shrink-0 p-1" {...field} />
                      </FormControl>
                      <Input value={field.value} onChange={field.onChange} className="flex-1" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Analytics</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="analyticsIds.googleAnalyticsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Analytics ID</FormLabel>
                  <FormControl>
                    <Input placeholder="G-XXXXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="analyticsIds.metaPixelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Pixel ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
