"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { subscribeToNewsletter } from "@/actions/public/newsletter";
import {
  newsletterFormSchema,
  type NewsletterFormValues,
} from "@/validators/public/newsletter-form.validator";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { $Enums } from "@/generated/prisma/client";

interface NewsletterFormProps {
  className?: string;
  variant?: "default" | "footer";
  /** Where this instance of the form lives — recorded on the subscriber so staff can see which forms actually drive signups. */
  source: $Enums.SubscriberSource;
}

export function NewsletterForm({
  className,
  variant = "default",
  source,
}: NewsletterFormProps) {
  const [isPending, startTransition] = useTransition();
  const isFooter = variant === "footer";

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: { email: "", firstName: "", company: "" },
  });

  function onSubmit(values: NewsletterFormValues) {
    startTransition(async () => {
      const result = await subscribeToNewsletter({ ...values, source });
      if (result.success) {
        toast.success(result.message);
        trackEvent({ name: "newsletter_submitted", props: { source } });
        form.reset();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className={cn("flex flex-col gap-2", className)}
      >
        {/* Honeypot — invisible to real visitors, off-screen rather than
            display:none (which some bots specifically detect and skip). */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto size-px overflow-hidden">
          <label htmlFor={`newsletter-company-${variant}`}>Company</label>
          <input
            id={`newsletter-company-${variant}`}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("company")}
          />
        </div>

        {!isFooter && (
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="gap-0">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="First name (optional)"
                    aria-label="First name"
                    autoComplete="given-name"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1 gap-0">
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    aria-label="Email address"
                    autoComplete="email"
                    className={cn(
                      isFooter &&
                        "border-paper-50/15 bg-transparent text-paper-50 placeholder:text-stone-500 focus-visible:border-gold-400/60 focus-visible:ring-gold-400/30"
                    )}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="gold"
            disabled={isPending}
            className="shrink-0"
          >
            {isPending ? "Joining…" : "Join Newsletter"}
          </Button>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={() => (
            <FormMessage className={cn(isFooter && "text-gold-300")} />
          )}
        />
        <p className={cn("text-xs leading-relaxed", isFooter ? "text-stone-500" : "text-muted-foreground")}>
          By subscribing you agree to receive occasional email updates. Unsubscribe anytime.
        </p>
      </form>
    </Form>
  );
}
