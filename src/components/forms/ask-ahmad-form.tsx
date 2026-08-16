"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/form";
import { submitQuestion } from "@/actions/public/ask";
import { askFormSchema, type AskFormValues } from "@/validators/public/ask-form.validator";
import { trackEvent } from "@/lib/analytics";

const TOPICS: { value: AskFormValues["topic"]; label: string }[] = [
  { value: "marriage", label: "Marriage" },
  { value: "family", label: "Family" },
  { value: "aqeedah", label: "Aqeedah" },
  { value: "fiqh", label: "Fiqh" },
  { value: "ruqyah", label: "Ruqyah" },
  { value: "mental-health", label: "Mental Health" },
  { value: "other", label: "Other" },
];

const QUESTION_MAX = 2000;

function SuccessScreen({ referenceNumber, onReset }: { referenceNumber: string; onReset: () => void }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success-100 text-success-500">
        <Check className="size-6" />
      </div>
      <h2 className="mt-5 font-display text-2xl text-foreground">Your question has been received</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Ahmad reviews questions personally — not every one can receive a public or private reply, but
        every one is read. Keep this reference number in case you&rsquo;d like to follow up.
      </p>

      {referenceNumber && (
        <button
          type="button"
          onClick={handleCopy}
          className="mx-auto mt-6 flex items-center gap-2 rounded-lg border border-border bg-paper-100/60 px-4 py-2.5 font-mono text-sm text-navy-900 transition-colors hover:border-gold-400/60"
        >
          {referenceNumber}
          {copied ? <Check className="size-3.5 text-success-500" /> : <Copy className="size-3.5 text-stone-500" />}
        </button>
      )}

      <Button type="button" variant="outline" size="lg" className="mt-8" onClick={onReset}>
        Ask another question
      </Button>
    </div>
  );
}

export function AskAhmadForm() {
  const [isPending, startTransition] = useTransition();
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

  const form = useForm<AskFormValues>({
    resolver: zodResolver(askFormSchema),
    defaultValues: { name: "", email: "", question: "", consent: false, company: "" },
  });

  const questionValue = useWatch({ control: form.control, name: "question" });
  const questionLength = questionValue?.length ?? 0;

  function onSubmit(values: AskFormValues) {
    startTransition(async () => {
      const result = await submitQuestion(values);
      if (result.success) {
        trackEvent({ name: "ask_ahmad_submitted", props: { category: values.topic } });
        setReferenceNumber(result.data.referenceNumber);
      } else {
        toast.error(result.message);
      }
    });
  }

  if (referenceNumber !== null) {
    return (
      <SuccessScreen
        referenceNumber={referenceNumber}
        onReset={() => {
          form.reset();
          setReferenceNumber(null);
        }}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-6"
      >
        {/* Honeypot — invisible to real visitors, off-screen rather than
            display:none (which some bots specifically detect and skip). */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto size-px overflow-hidden">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("company")}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TOPICS.map((topic) => (
                    <SelectItem key={topic.value} value={topic.value}>
                      {topic.label}
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
          name="question"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-baseline justify-between">
                <FormLabel>Your question</FormLabel>
                <span
                  className={
                    "text-xs " +
                    (questionLength > QUESTION_MAX ? "text-destructive" : "text-muted-foreground")
                  }
                >
                  {questionLength} / {QUESTION_MAX}
                </span>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Ask anything about marriage, family, aqeedah, fiqh, ruqyah, or mental health…"
                  rows={6}
                  maxLength={QUESTION_MAX}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-2.5">
                <FormControl>
                  <Checkbox
                    id="consent"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                </FormControl>
                <Label htmlFor="consent" className="cursor-pointer text-sm font-normal leading-relaxed text-foreground/90">
                  I understand my question is read only by Ahmad and is never shared publicly without my
                  permission. Submitting a question does not guarantee a response.
                </Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="gold" size="lg" disabled={isPending}>
          {isPending ? "Sending…" : "Ask a Question"}
        </Button>
      </form>
    </Form>
  );
}
