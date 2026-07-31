import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

const TONES = {
  paper: "bg-background",
  alt: "bg-paper-100",
  navy: "bg-navy-950 text-paper-50",
} as const;

interface SectionProps extends React.ComponentProps<"section"> {
  tone?: keyof typeof TONES;
  containerWidth?: React.ComponentProps<typeof Container>["width"];
}

export function Section({
  tone = "paper",
  containerWidth = "wide",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-20 sm:py-28", TONES[tone], className)} {...props}>
      <Container width={containerWidth}>{children}</Container>
    </section>
  );
}
