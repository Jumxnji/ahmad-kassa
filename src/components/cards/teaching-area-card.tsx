import { type LucideIcon } from "lucide-react";

interface TeachingAreaCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function TeachingAreaCard({ title, description, icon: Icon }: TeachingAreaCardProps) {
  return (
    <div className="group flex flex-col items-start rounded-xl border border-transparent p-6 transition-colors hover:border-gold-300/50 hover:bg-background">
      <span className="flex size-11 items-center justify-center rounded-full bg-gold-100 text-gold-700 transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
        <Icon className="size-5" strokeWidth={1.5} />
      </span>
      <h3 className="mt-5 font-display text-lg text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
