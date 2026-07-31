"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { loginAction } from "@/actions/auth/login";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const loginFormSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  remember: z.boolean(),
});
type LoginFormValues = z.infer<typeof loginFormSchema>;

const REASON_MESSAGES: Record<string, { message: string; tone: "error" | "success" }> = {
  session_expired: { message: "Your session has expired — please sign in again.", tone: "error" },
  unauthenticated: { message: "Please sign in to continue.", tone: "error" },
  password_reset: {
    message: "Password updated — sign in with your new password.",
    tone: "success",
  },
};

export function LoginForm({ callbackUrl, reason }: { callbackUrl: string; reason?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const notice = reason ? REASON_MESSAGES[reason] : undefined;
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  function onSubmit(values: LoginFormValues) {
    setFormError(null);
    startTransition(async () => {
      const result = await loginAction(values);
      if (result.success) {
        // Prefer the page the user was originally trying to reach
        // over the action's generic default.
        router.push(callbackUrl || result.data.redirectTo);
        router.refresh();
      } else {
        setFormError(result.message);
      }
    });
  }

  return (
    <Card className="border-none p-6 shadow-none ring-1 ring-border">
      <CardHeader className="px-0 text-center">
        <CardTitle className="font-display text-2xl font-normal text-foreground">
          Welcome back
        </CardTitle>
        <CardDescription>Sign in to manage the site.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {!formError && notice && (
          <Alert variant={notice.tone === "success" ? "success" : "destructive"} className="mb-5">
            {notice.tone === "success" ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <AlertCircle className="size-4" />
            )}
            <AlertDescription>{notice.message}</AlertDescription>
          </Alert>
        )}
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/admin/forgot-password"
                      className="text-xs text-navy-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      id="remember"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">
                    Remember me for 30 days
                  </Label>
                </FormItem>
              )}
            />
            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isPending}>
              {isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
