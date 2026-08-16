import type { LucideIcon } from "lucide-react";

const TONE_CLASSES = {
  success: "bg-success-100 text-success-500",
  warning: "bg-warning-100 text-warning-500",
  destructive: "bg-destructive/10 text-destructive",
} as const;

interface StateCardProps {
  icon: LucideIcon;
  tone: keyof typeof TONE_CLASSES;
  title: string;
  description: string;
  children?: React.ReactNode;
}

/** Centered icon/heading/description card for a single-outcome page state — confirmation, unsubscribe, and similar transactional-link landings. */
export function StateCard({ icon: Icon, tone, title, description, children }: StateCardProps) {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-8 text-center">
      <div className={`mx-auto flex size-12 items-center justify-center rounded-full ${TONE_CLASSES[tone]}`}>
        <Icon className="size-6" />
      </div>
      <h1 className="mt-5 font-display text-2xl text-foreground">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}
