import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "warning" | "success" | "muted";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-gold-100 text-gold-700",
  warning: "bg-warning-100 text-warning-500",
  success: "bg-success-100 text-success-500",
  muted: "bg-paper-100 text-stone-600",
};

interface StatusBadgeProps {
  label: string;
  tone?: Tone;
  className?: string;
}

export function StatusBadge({ label, tone = "neutral", className }: StatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn("border-none", TONE_CLASSES[tone], className)}>
      {label}
    </Badge>
  );
}
