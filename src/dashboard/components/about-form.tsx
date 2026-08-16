"use client";

import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { RichTextEditor } from "@/dashboard/components/rich-text-editor";
import { SeoFields } from "@/dashboard/components/seo-fields";
import { AutosaveIndicator } from "@/dashboard/components/autosave-indicator";
import { useAutosave } from "@/hooks/use-autosave";
import { updateAboutAction } from "@/actions/admin/about.actions";
import { aboutContentSchema } from "@/schemas/about.schema";
import type { AboutContent, Seo } from "@/generated/prisma/client";

// The form works with badges as a single comma-separated string for a
// simpler input; the schema (array of strings) still validates on submit.
const aboutFormSchema = aboutContentSchema.extend({
  badges: z.string(),
});
type AboutFormValues = z.infer<typeof aboutFormSchema>;

export function AboutForm({ about }: { about: (AboutContent & { seo: Seo | null }) | null }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: {
      introHeadline: about?.introHeadline ?? "Ahmad Mohamed Kassa",
      introText: about?.introText ?? "",
      biography: about?.biography ?? "",
      missionText: about?.missionText ?? "",
      futureVisionText: about?.futureVisionText ?? "",
      badges: about?.badges?.join(", ") ?? "",
      seo: {
        metaTitle: about?.seo?.metaTitle ?? "",
        metaDescription: about?.seo?.metaDescription ?? "",
        noindex: about?.seo?.noindex ?? false,
      },
    },
  });

  function toActionPayload(values: AboutFormValues) {
    return {
      ...values,
      badges: values.badges
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
    };
  }

  function onSubmit(values: AboutFormValues) {
    startTransition(async () => {
      const result = await updateAboutAction(toActionPayload(values));
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  const watched = useWatch({ control: form.control });
  const autosaveStatus = useAutosave({
    value: watched,
    enabled: form.formState.isDirty,
    onSave: async (values) => {
      const result = await updateAboutAction(toActionPayload(values as AboutFormValues));
      if (!result.success) toast.error(result.message);
      return { success: result.success };
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8">
        <div className="flex justify-end">
          <AutosaveIndicator status={autosaveStatus} />
        </div>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Intro</h2>
          <div className="mt-4 space-y-6">
            <FormField
              control={form.control}
              name="introHeadline"
              render={({ field }) => (
                <FormItem>
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
              name="introText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intro text</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="badges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Badges</FormLabel>
                  <FormControl>
                    <Input placeholder="Khateeb, Author, Islamic Speaker" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated — shown under the intro.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Biography</h2>
          <div className="mt-4">
            <FormField
              control={form.control}
              name="biography"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichTextEditor value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    Formatting (headings, bold, lists, quotes) carries through to the full biography.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Card className="border-none p-6 shadow-none ring-1 ring-border">
          <h2 className="text-sm font-medium text-foreground">Mission</h2>
          <div className="mt-4">
            <FormField
              control={form.control}
              name="missionText"
              render={({ field }) => (
                <FormItem>
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
          <h2 className="text-sm font-medium text-foreground">Future vision</h2>
          <div className="mt-4">
            <FormField
              control={form.control}
              name="futureVisionText"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <SeoFields
          control={form.control}
          showCanonical={false}
          showKeywords={false}
          titleDefaultHint="Defaults to “About” if left blank."
          descriptionDefaultHint="Defaults to a standard bio summary if left blank."
        />

        <Button type="submit" variant="gold" size="lg" disabled={isPending}>
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
