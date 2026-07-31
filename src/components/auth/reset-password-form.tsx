"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { resetPasswordSchema, type ResetPasswordInput } from "@/schemas/auth.schema";
import { resetPasswordAction } from "@/actions/auth/reset-password";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "", confirmPassword: "" },
  });

  function onSubmit(values: ResetPasswordInput) {
    setFormError(null);
    startTransition(async () => {
      const result = await resetPasswordAction(values);
      if (result.success) {
        router.push("/admin/login?reason=password_reset");
      } else {
        setFormError(result.message);
      }
    });
  }

  if (!token) {
    return (
      <Card className="border-none p-6 shadow-none ring-1 ring-border">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            This reset link is missing its token. Request a new one from the{" "}
            <Link href="/admin/forgot-password" className="underline">
              forgot password
            </Link>{" "}
            page.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <Card className="border-none p-6 shadow-none ring-1 ring-border">
      <CardHeader className="px-0 text-center">
        <CardTitle className="font-display text-2xl font-normal text-foreground">
          Set a new password
        </CardTitle>
        <CardDescription>Choose something you haven&rsquo;t used before.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {formError && (
          <Alert variant="destructive" className="mb-5">
            <AlertCircle className="size-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isPending}>
              {isPending ? "Saving…" : "Set new password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
