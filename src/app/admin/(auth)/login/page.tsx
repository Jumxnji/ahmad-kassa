import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string; reason?: string }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect("/admin");
  }

  const { callbackUrl, reason } = await searchParams;

  return <LoginForm callbackUrl={callbackUrl ?? "/admin"} reason={reason} />;
}
