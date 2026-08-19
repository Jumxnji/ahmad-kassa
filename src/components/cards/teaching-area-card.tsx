interface TeachingAreaRowProps {
  index: number;
  title: string;
  description: string;
}

/**
 * An editorial index row, not a card — deliberately no icon, no
 * border box, no fill. A numbered contents-page entry: number and
 * title read together, description sits alongside at desktop width
 * and beneath at mobile width. Interaction is a single restrained
 * title colour shift on hover, nothing else.
 */
export function TeachingAreaRow({ index, title, description }: TeachingAreaRowProps) {
  return (
    <div className="group border-t border-stone-200 py-7 first:border-t-0 lg:grid lg:grid-cols-[3rem_1fr_1.3fr] lg:items-baseline lg:gap-10 lg:py-8">
      <div className="flex items-baseline gap-4 lg:contents">
        <span className="font-mono text-xs tracking-[0.18em] text-gold-700">
          {String(index).padStart(2, "0")}
        </span>
        <h3 className="font-display text-2xl text-foreground transition-colors duration-200 group-hover:text-gold-700 sm:text-3xl">
          {title}
        </h3>
      </div>
      <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground lg:mt-0 lg:max-w-none">
        {description}
      </p>
    </div>
  );
}
