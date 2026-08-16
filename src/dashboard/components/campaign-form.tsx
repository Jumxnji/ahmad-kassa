"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Monitor, Smartphone, Send as SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RichTextEditor } from "@/dashboard/components/rich-text-editor";
import { TagsInput } from "@/dashboard/components/tags-input";
import { AutosaveIndicator } from "@/dashboard/components/autosave-indicator";
import { ConfirmDialog } from "@/dashboard/components/confirm-dialog";
import { useAutosave } from "@/hooks/use-autosave";
import {
  updateCampaignAction,
  markCampaignStatusAction,
  previewCampaignEmailAction,
  sendTestCampaignEmailAction,
  sendCampaignAction,
} from "@/actions/admin/campaign.actions";
import { updateCampaignSchema, type UpdateCampaignInput } from "@/validators/campaign.validator";
import { EDITABLE_CAMPAIGN_STATUSES } from "@/schemas/campaign.schema";
import { CAMPAIGN_STATUS_LABEL, CAMPAIGN_STATUS_TONE } from "@/dashboard/newsletter-constants";
import { StatusBadge } from "@/dashboard/components/status-badge";
import { locales, localeLabels } from "@/config/i18n";
import { isFeatureEnabled } from "@/features/flags";
import type { Campaign } from "@/generated/prisma/client";

function derivePlainText(html: string): string {
  if (typeof document === "undefined") return "";
  const withBreaks = html.replace(/<\/(p|li|h2|h3|blockquote)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n");
  const div = document.createElement("div");
  div.innerHTML = withBreaks;
  return (div.textContent || "").replace(/\n{3,}/g, "\n\n").trim();
}

interface CampaignFormProps {
  campaign: Campaign;
  activeSubscriberCount: number;
  canSend: boolean;
}

export function CampaignForm({ campaign, activeSubscriberCount, canSend }: CampaignFormProps) {
  const router = useRouter();
  const [tab, setTab] = useState("details");
  const [preview, setPreview] = useState<{ html: string; text: string } | null>(null);
  const [previewWidth, setPreviewWidth] = useState<"desktop" | "mobile">("desktop");
  const [testEmails, setTestEmails] = useState<string[]>([]);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const readOnly = !EDITABLE_CAMPAIGN_STATUSES.includes(
    campaign.status as (typeof EDITABLE_CAMPAIGN_STATUSES)[number]
  );
  const schedulingEnabled = isFeatureEnabled("newsletterScheduling");

  const form = useForm<UpdateCampaignInput>({
    resolver: zodResolver(updateCampaignSchema),
    defaultValues: {
      internalName: campaign.internalName,
      title: campaign.title,
      subject: campaign.subject,
      previewText: campaign.previewText ?? "",
      content: campaign.content,
      plainTextContent: campaign.plainTextContent,
      ctaLabel: campaign.ctaLabel ?? "",
      ctaUrl: campaign.ctaUrl ?? "",
      secondaryContent: campaign.secondaryContent ?? "",
      senderName: campaign.senderName ?? "",
      replyToEmail: campaign.replyToEmail ?? "",
      language: campaign.language,
    },
  });

  const watched = useWatch({ control: form.control });
  const autosaveStatus = useAutosave({
    value: watched,
    enabled: !readOnly,
    onSave: async (values) => {
      const result = await updateCampaignAction(campaign.id, values);
      if (!result.success) toast.error(result.message);
      return { success: result.success };
    },
  });

  useEffect(() => {
    if (tab !== "preview") return;
    previewCampaignEmailAction(campaign.id).then((result) => {
      if (result.success) setPreview(result.data);
    });
  }, [tab, campaign.id]);

  function handleStatusToggle() {
    const next = campaign.status === "DRAFT" ? "READY" : "DRAFT";
    markCampaignStatusAction(campaign.id, next).then((result) => {
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleSendTest() {
    setIsSendingTest(true);
    sendTestCampaignEmailAction(campaign.id, { emails: testEmails })
      .then((result) => {
        if (result.success) {
          toast.success(`Sent to ${result.data.sent} address(es)${result.data.failed ? `, ${result.data.failed} failed` : ""}.`);
        } else {
          toast.error(result.message);
        }
      })
      .finally(() => setIsSendingTest(false));
  }

  async function handleSend() {
    setIsSending(true);
    try {
      const result = await sendCampaignAction(campaign.id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSending(false);
    }
  }

  const values = form.getValues();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <StatusBadge label={CAMPAIGN_STATUS_LABEL[campaign.status]} tone={CAMPAIGN_STATUS_TONE[campaign.status]} />
          {!readOnly && (
            <Button type="button" variant="ghost" size="sm" onClick={handleStatusToggle}>
              {campaign.status === "DRAFT" ? "Mark as ready" : "Move back to draft"}
            </Button>
          )}
        </div>
        {!readOnly && <AutosaveIndicator status={autosaveStatus} />}
      </div>

      {readOnly && (
        <div className="rounded-lg border border-border bg-paper-100/60 px-4 py-3 text-sm text-muted-foreground">
          This campaign has already started sending and is now a read-only record.
        </div>
      )}

      <Form {...form}>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="test">Test Email</TabsTrigger>
              <TabsTrigger value="review">Review &amp; Send</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6 max-w-2xl space-y-5">
              <FormField
                control={form.control}
                name="internalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Internal campaign name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email subject</FormLabel>
                    <FormControl>
                      <Input placeholder="What subscribers see in their inbox" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="previewText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preview text</FormLabel>
                    <FormControl>
                      <Input placeholder="Shown next to the subject in inbox lists" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="senderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sender name override</FormLabel>
                      <FormControl>
                        <Input placeholder="Defaults to Settings" {...field} disabled={readOnly} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="replyToEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reply-to override</FormLabel>
                      <FormControl>
                        <Input placeholder="Defaults to Settings" {...field} disabled={readOnly} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={readOnly}>
                      <FormControl>
                        <SelectTrigger className="w-full sm:w-56">
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
            </TabsContent>

            <TabsContent value="content" className="mt-6 max-w-2xl space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heading</FormLabel>
                    <FormControl>
                      <Input placeholder="The heading shown inside the email" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main content</FormLabel>
                    <FormControl>
                      <RichTextEditor value={field.value ?? ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="ctaLabel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary CTA label</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Get the book" {...field} disabled={readOnly} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ctaUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary CTA URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://…" {...field} disabled={readOnly} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="secondaryContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary content (optional)</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="plainTextContent"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Plain-text fallback</FormLabel>
                      {!readOnly && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange(derivePlainText(form.getValues("content") ?? ""))}
                        >
                          Generate from content
                        </Button>
                      )}
                    </div>
                    <FormControl>
                      <Textarea rows={8} className="font-mono text-xs" {...field} disabled={readOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="audience" className="mt-6 max-w-2xl">
              <Card className="border-none p-6 shadow-none ring-1 ring-border">
                <p className="text-eyebrow">Audience</p>
                <p className="mt-3 font-display text-3xl text-foreground">{activeSubscriberCount}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  All confirmed, active subscribers. Never Pending, Unsubscribed, Suppressed, Bounced, or
                  Complained.
                </p>
              </Card>
              <div className="mt-4 flex items-center gap-2 opacity-50">
                <Label className="text-sm">Segment</Label>
                <Select disabled value="all">
                  <SelectTrigger className="w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All active subscribers</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground">Segmentation is coming in a future release.</span>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={previewWidth === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewWidth("desktop")}
                >
                  <Monitor className="size-3.5" data-icon="inline-start" />
                  Desktop
                </Button>
                <Button
                  type="button"
                  variant={previewWidth === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewWidth("mobile")}
                >
                  <Smartphone className="size-3.5" data-icon="inline-start" />
                  Mobile
                </Button>
              </div>
              {preview ? (
                <>
                  <iframe
                    title="Campaign email preview"
                    srcDoc={preview.html}
                    className="mx-auto rounded-lg border border-border bg-white"
                    style={{ width: previewWidth === "desktop" ? "640px" : "375px", height: "700px", maxWidth: "100%" }}
                  />
                  <div>
                    <p className="text-eyebrow">Plain-text version</p>
                    <pre className="mt-2 max-w-2xl overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-paper-100/60 p-4 text-xs text-foreground/80">
                      {preview.text}
                    </pre>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Loading preview…</p>
              )}
            </TabsContent>

            <TabsContent value="test" className="mt-6 max-w-xl space-y-4">
              <div className="space-y-2">
                <Label>Test recipient addresses</Label>
                <TagsInput value={testEmails} onChange={setTestEmails} placeholder="you@example.com" max={5} />
                <p className="text-xs text-muted-foreground">
                  Sent from the current draft content — never counted as real recipients, never changes this
                  campaign&rsquo;s status.
                </p>
              </div>
              <Button type="button" variant="gold" disabled={isSendingTest || testEmails.length === 0} onClick={handleSendTest}>
                {isSendingTest ? "Sending…" : "Send test email"}
              </Button>
            </TabsContent>

            <TabsContent value="review" className="mt-6 max-w-2xl space-y-6">
              <Card className="divide-y divide-border border-none p-0 shadow-none ring-1 ring-border">
                {[
                  ["Subject", values.subject || "(No subject yet)"],
                  ["Sender", values.senderName || "Default sender (see Settings)"],
                  ["Reply-to", values.replyToEmail || "Default reply-to (see Settings)"],
                  ["Audience", `All active subscribers — ${activeSubscriberCount} recipient(s)`],
                  ["Delivery", "Immediate on send"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="max-w-xs truncate text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </Card>

              <div className="flex flex-wrap items-center gap-3">
                <ConfirmDialog
                  trigger={
                    <Button
                      type="button"
                      variant="gold"
                      size="lg"
                      disabled={!canSend || readOnly || isSending || activeSubscriberCount === 0}
                    >
                      <SendIcon className="size-4" data-icon="inline-start" />
                      Send now
                    </Button>
                  }
                  title="Send this campaign now?"
                  description={`This immediately emails ${activeSubscriberCount} active subscriber(s). This can't be undone.`}
                  confirmLabel="Send now"
                  onConfirm={handleSend}
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0}>
                      <Button type="button" variant="outline" size="lg" disabled>
                        Schedule for later
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {schedulingEnabled
                      ? "Scheduling is enabled but not yet wired to this campaign."
                      : "Scheduled sending needs a configured cron job — see docs/DEPLOYMENT.md."}
                  </TooltipContent>
                </Tooltip>

                {!canSend && (
                  <p className="text-xs text-muted-foreground">
                    Your role can prepare and test campaigns but not send to the full list.
                  </p>
                )}
                {activeSubscriberCount === 0 && (
                  <p className="text-xs text-muted-foreground">There are no active subscribers to send to yet.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
