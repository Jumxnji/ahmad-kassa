import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

const TONES = {
  paper: "bg-background",
  alt: "bg-paper-100",
  navy: "bg-navy-950 text-paper-50",
} as const;

const SIZES = {
  default: "py-20 sm:py-28",
  lg: "py-28 sm:py-36",
} as const;

interface SectionProps extends React.ComponentProps<"section"> {
  tone?: keyof typeof TONES;
  /** `"lg"` gives a section more vertical room to read as more important — used sparingly, not on every section. */
  size?: keyof typeof SIZES;
  /** Layers the faint manuscript-texture background (gold radial glow + hairline geometric tile) behind the content. Picks the navy-tuned variant automatically when `tone="navy"`. */
  texture?: boolean;
  containerWidth?: React.ComponentProps<typeof Container>["width"];
}

export function Section({
  tone = "paper",
  size = "default",
  texture = false,
  containerWidth = "wide",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        SIZES[size],
        TONES[tone],
        texture && (tone === "navy" ? "manuscript-texture-navy" : "manuscript-texture"),
        className
      )}
      {...props}
    >
      <Container width={containerWidth}>{children}</Container>
    </section>
  );
}
