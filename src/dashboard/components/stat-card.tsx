import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  href?: string;
  hint?: string;
}

export function StatCard({ label, value, icon: Icon, href, hint }: StatCardProps) {
  const content = (
    <Card className="border-none p-6 shadow-none ring-1 ring-border transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <p className="text-eyebrow">{label}</p>
        <span className="flex size-8 items-center justify-center rounded-full bg-navy-50 text-navy-800">
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
      </div>
      <p className="mt-4 font-display text-3xl text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );

  if (!href) return content;

  return (
    <Link href={href} className={cn("block")}>
      {content}
    </Link>
  );
}
