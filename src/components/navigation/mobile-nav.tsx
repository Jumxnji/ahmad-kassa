"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ManuscriptDivider } from "@/components/shared/manuscript-divider";
import { PRIMARY_NAV } from "@/constants/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xs">
        <SheetHeader>
          <SheetTitle className="text-lg">Menu</SheetTitle>
        </SheetHeader>
        <ManuscriptDivider />
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
          {PRIMARY_NAV.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className="rounded-md px-2 py-3 text-base text-foreground transition-colors hover:bg-muted"
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
          <SheetClose asChild>
            <Button asChild variant="gold" size="lg">
              <Link href="/newsletter">Join the newsletter</Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Log in</Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
