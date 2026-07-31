import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-border bg-paper-100/60 px-6 py-16 text-center",
        className
      )}
    >
      {Icon && (
        <span className="mb-5 flex size-12 items-center justify-center rounded-full border border-gold-300 text-gold-600">
          <Icon className="size-5" strokeWidth={1.5} />
        </span>
      )}
      <h3 className="font-display text-xl text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
