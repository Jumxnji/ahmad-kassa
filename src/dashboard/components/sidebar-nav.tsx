"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV } from "@/dashboard/nav-config";
import { can } from "@/permissions/permissions";
import type { Role } from "@/permissions/roles";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({
  role,
  onNavigate,
  "aria-label": ariaLabel = "Primary",
}: {
  role: Role;
  onNavigate?: () => void;
  "aria-label"?: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className="flex flex-col gap-6">
      {DASHBOARD_NAV.map((section) => {
        const items = section.items.filter(
          (item) => !item.resource || can(role, item.resource, "read")
        );
        if (items.length === 0) return null;

        return (
          <div key={section.label}>
            <p className="px-3 text-eyebrow text-stone-400">{section.label}</p>
            <ul className="mt-2 space-y-0.5">
              {items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-navy-900 text-paper-50"
                          : "text-foreground/75 hover:bg-paper-100 hover:text-foreground"
                      )}
                    >
                      <item.icon className="size-4 shrink-0" strokeWidth={1.75} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
