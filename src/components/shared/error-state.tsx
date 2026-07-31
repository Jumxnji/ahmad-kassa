import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "The page ran into a problem. Try again, or come back shortly.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-destructive/20 bg-error-100/40 px-6 py-16 text-center",
        className
      )}
    >
      <span className="mb-5 flex size-12 items-center justify-center rounded-full border border-destructive/30 text-destructive">
        <AlertTriangle className="size-5" strokeWidth={1.5} />
      </span>
      <h3 className="font-display text-xl text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {onRetry && (
        <Button variant="outline" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
