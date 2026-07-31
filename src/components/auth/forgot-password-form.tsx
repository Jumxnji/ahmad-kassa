"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { requestPasswordResetAction } from "@/actions/auth/forgot-password";

const formSchema = z.object({ email: z.email("Enter a valid email address.") });
type FormValues = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await requestPasswordResetAction(values);
      // Always show the generic success message, even on a validation
      // error, except for the one real client-side case (empty/invalid
      // email) already caught by the resolver before this runs.
      setSentMessage(result.message);
    });
  }

  if (sentMessage) {
    return (
      <Card className="border-none p-6 shadow-none ring-1 ring-border">
        <div className="flex flex-col items-center text-center">
          <span className="mb-4 flex size-12 items-center justify-center rounded-full border border-gold-300 text-gold-600">
            <CheckCircle2 className="size-5" strokeWidth={1.5} />
          </span>
          <p className="text-sm leading-relaxed text-foreground/90">{sentMessage}</p>
          <Link href="/admin/login" className="mt-6 text-sm text-navy-700 hover:underline">
            Back to sign in
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-none p-6 shadow-none ring-1 ring-border">
      <CardHeader className="px-0 text-center">
        <CardTitle className="font-display text-2xl font-normal text-foreground">
          Forgot your password?
        </CardTitle>
        <CardDescription>We&rsquo;ll email you a link to set a new one.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isPending}>
              {isPending ? "Sending…" : "Send reset link"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/admin/login" className="text-navy-700 hover:underline">
                Back to sign in
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
