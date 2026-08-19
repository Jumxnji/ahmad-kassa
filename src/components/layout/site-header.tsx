"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";
import { MainNav } from "@/components/navigation/main-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { SearchTrigger } from "@/components/navigation/search-trigger";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-background/85 backdrop-blur-md transition-shadow duration-300",
        scrolled && "shadow-sm"
      )}
    >
      <Container width="ultra">
        <div className="flex h-18 items-center justify-between gap-6">
          <Logo />
          <MainNav />
          <div className="flex items-center gap-1">
            <SearchTrigger />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/newsletter">Newsletter</Link>
            </Button>
            <MobileNav />
          </div>
        </div>
      </Container>
      <ManuscriptDivider />
    </header>
  );
}
