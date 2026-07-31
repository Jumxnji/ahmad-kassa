import { cn } from "@/lib/utils";

const WIDTHS = {
  content: "max-w-content",
  narrow: "max-w-narrow",
  wide: "max-w-wide",
  ultra: "max-w-ultra",
} as const;

interface ContainerProps extends React.ComponentProps<"div"> {
  width?: keyof typeof WIDTHS;
}

export function Container({
  width = "wide",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-6 sm:px-8 lg:px-12", WIDTHS[width], className)}
      {...props}
    />
  );
}
