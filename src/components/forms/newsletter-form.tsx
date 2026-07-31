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
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  className?: string;
  variant?: "default" | "footer";
}

export function NewsletterForm({
  className,
  variant = "default",
}: NewsletterFormProps) {
  const [isPending, startTransition] = useTransition();
  const isFooter = variant === "footer";

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: NewsletterFormValues) {
    startTransition(async () => {
      const result = await subscribeToNewsletter(values);
      if (result.success) {
        toast.success(result.message);
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
      </form>
    </Form>
  );
}
