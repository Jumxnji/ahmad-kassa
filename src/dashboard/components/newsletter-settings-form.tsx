"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagsInput } from "@/dashboard/components/tags-input";
import { updateNewsletterSettingsAction } from "@/actions/admin/newsletter-settings.actions";
import {
  updateNewsletterSettingsSchema,
  type UpdateNewsletterSettingsInput,
} from "@/validators/newsletter-settings.validator";
import { locales, localeLabels } from "@/config/i18n";
import type { NewsletterSettings } from "@/generated/prisma/client";

export function NewsletterSettingsForm({ settings }: { settings: NewsletterSettings }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(updateNewsletterSettingsSchema),
    defaultValues: {
      senderName: settings.senderName,
      senderEmail: settings.senderEmail,
      replyToEmail: settings.replyToEmail ?? "",
      confirmationSubject: settings.confirmationSubject,
      welcomeSubject: settings.welcomeSubject,
      defaultFooterText: settings.defaultFooterText ?? "",
      businessAddress: settings.businessAddress ?? "",
      defaultLanguage: settings.defaultLanguage,
      confirmationTokenExpiryHours: settings.confirmationTokenExpiryHours,
      testEmailAllowlist: settings.testEmailAllowlist,
    },
  });

  function onSubmit(values: UpdateNewsletterSettingsInput) {
    startTransition(async () => {
      const result = await updateNewsletterSettingsAction(values);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <Card className="space-y-5 border-none p-6 shadow-none ring-1 ring-border">
          <p className="text-eyebrow">Sender identity</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="senderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sender name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senderEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sender email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormDescription>Must be on a domain verified in Resend.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="replyToEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reply-to email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Optional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        <Card className="space-y-5 border-none p-6 shadow-none ring-1 ring-border">
          <p className="text-eyebrow">Subject lines</p>
          <FormField
            control={form.control}
            name="confirmationSubject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmation email subject</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="welcomeSubject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Welcome email subject</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        <Card className="space-y-5 border-none p-6 shadow-none ring-1 ring-border">
          <p className="text-eyebrow">Compliance &amp; defaults</p>
          <FormField
            control={form.control}
            name="defaultFooterText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default campaign footer</FormLabel>
                <FormControl>
                  <Textarea rows={2} placeholder="Optional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business / correspondence address</FormLabel>
                <FormControl>
                  <Textarea rows={2} placeholder="Optional — shown in every campaign footer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="defaultLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default language</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locales.map((locale) => (
                        <SelectItem key={locale} value={locale}>
                          {localeLabels[locale]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmationTokenExpiryHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmation link expiry (hours)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={336} {...field} value={field.value as number} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Card className="space-y-3 border-none p-6 shadow-none ring-1 ring-border">
          <p className="text-eyebrow">Test-email allowlist</p>
          <FormField
            control={form.control}
            name="testEmailAllowlist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Addresses (non-production reference only)</FormLabel>
                <FormControl>
                  <TagsInput value={field.value} onChange={field.onChange} placeholder="you@example.com" max={20} />
                </FormControl>
                <FormDescription>
                  A quick-reference list for staff — the Test Email tab still accepts any address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        <Button type="submit" variant="gold" size="lg" disabled={isPending}>
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
