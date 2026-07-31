"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Menu } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarNav } from "@/dashboard/components/sidebar-nav";
import { ROLE_LABELS } from "@/permissions/roles";
import type { CurrentUser } from "@/permissions/current-user";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function DashboardShell({
  user,
  children,
}: {
  user: CurrentUser | null;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <SidebarNav />
        </div>
        <div className="border-t border-border p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-paper-100 hover:text-foreground"
          >
            <ExternalLink className="size-4" strokeWidth={1.75} />
            View live site
          </Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="h-16 justify-center border-b border-border px-5">
                <SheetTitle asChild>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto px-3 py-6">
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-tight text-foreground">{user.name}</p>
                <p className="text-xs leading-tight text-muted-foreground">
                  {ROLE_LABELS[user.role]}
                </p>
              </div>
              <Avatar className="size-9">
                <AvatarFallback className="bg-navy-900 text-xs text-gold-300">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </header>

        <main id="main-content" className="px-4 py-8 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
