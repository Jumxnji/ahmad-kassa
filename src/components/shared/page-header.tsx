import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/shared/eyebrow";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="mt-3 text-4xl leading-tight text-balance sm:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-balance">
          {description}
        </p>
      )}
    </div>
  );
}
