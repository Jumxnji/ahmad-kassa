import { AlertCircle, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AutosaveStatus } from "@/hooks/use-autosave";

const CONFIG: Record<AutosaveStatus, { label: string; className: string } | null> = {
  idle: null,
  pending: { label: "Unsaved changes", className: "text-muted-foreground" },
  saving: { label: "Saving…", className: "text-muted-foreground" },
  saved: { label: "All changes saved", className: "text-success-500" },
  error: { label: "Couldn't save — check your connection", className: "text-destructive" },
};

export function AutosaveIndicator({ status }: { status: AutosaveStatus }) {
  const config = CONFIG[status];
  if (!config) return <span className="h-5" aria-hidden="true" />;

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-xs", config.className)}
      role="status"
      aria-live="polite"
    >
      {status === "saving" && <Loader2 className="size-3 animate-spin" />}
      {status === "saved" && <Check className="size-3" />}
      {status === "error" && <AlertCircle className="size-3" />}
      {status === "pending" && <span className="size-1.5 rounded-full bg-gold-500" />}
      {config.label}
    </span>
  );
}
