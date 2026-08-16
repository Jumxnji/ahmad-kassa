"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check } from "lucide-react";
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
} from "@/components/ui/form";
import { submitContactForm } from "@/actions/public/contact";
import { trackEvent } from "@/lib/analytics";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/validators/public/contact-form.validator";

const REASONS: { value: ContactFormValues["reason"]; label: string }[] = [
  { value: "speaking", label: "Speaking engagements" },
  { value: "seminars", label: "Seminars" },
  { value: "books", label: "Book enquiries" },
  { value: "media", label: "Media enquiries" },
  { value: "general", label: "General enquiries" },
];

function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success-100 text-success-500">
        <Check className="size-6" />
      </div>
      <h2 className="mt-5 font-display text-2xl text-foreground">Your message has been sent</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Thank you for getting in touch — we aim to respond as soon as possible.
      </p>
      <Button type="button" variant="outline" size="lg" className="mt-8" onClick={onReset}>
        Send another message
      </Button>
    </div>
  );
}

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", subject: "", message: "", company: "" },
  });

  function onSubmit(values: ContactFormValues) {
    startTransition(async () => {
      const result = await submitContactForm(values);
      if (result.success) {
        trackEvent({ name: "contact_submitted", props: { reason: values.reason } });
        setSubmitted(true);
      } else {
        toast.error(result.message);
      }
    });
  }

  if (submitted) {
    return (
      <SuccessScreen
        onReset={() => {
          form.reset();
          setSubmitted(false);
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
        {/* Honeypot — see ask-ahmad-form.tsx for why this stays off-screen rather than display:none. */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto size-px overflow-hidden">
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
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
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for enquiry</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a reason" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {REASONS.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
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
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="What's this regarding?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="How can we help?"
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="gold" size="lg" disabled={isPending}>
          {isPending ? "Sending…" : "Send message"}
        </Button>
      </form>
    </Form>
  );
}
