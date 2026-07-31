"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps extends React.ComponentProps<typeof Link> {
  href: string;
}

export function NavLink({ href, className, children, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
        isActive && "text-foreground",
        className
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-gold-500 transition-transform duration-300",
          isActive && "scale-x-100"
        )}
      />
    </Link>
  );
}
