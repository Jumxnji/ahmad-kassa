import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SuccessState({
  title = "You're all set",
  description,
  action,
  className,
}: SuccessStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-success/20 bg-success-100/50 px-6 py-16 text-center",
        className
      )}
    >
      <span className="mb-5 flex size-12 items-center justify-center rounded-full border border-success/30 text-success">
        <CheckCircle2 className="size-5" strokeWidth={1.5} />
      </span>
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
