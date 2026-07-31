import type { ArticleBlock } from "@/types/content";

interface ArticleBodyProps {
  blocks: readonly ArticleBlock[];
}

export function ArticleBody({ blocks }: ArticleBodyProps) {
  return (
    <div className="max-w-none space-y-6 text-lg leading-relaxed text-foreground/90">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={block.id}
                id={block.id}
                className="scroll-mt-28 pt-6 text-2xl leading-snug sm:text-3xl"
              >
                {block.text}
              </h2>
            );
          case "quote":
            return (
              <blockquote
                key={index}
                className="border-l-2 border-gold-400 py-1 pl-6 font-display text-xl italic leading-relaxed text-foreground"
              >
                <p>&ldquo;{block.text}&rdquo;</p>
                {block.attribution && (
                  <cite className="mt-2 block text-sm not-italic text-muted-foreground">
                    — {block.attribution}
                  </cite>
                )}
              </blockquote>
            );
          case "paragraph":
          default:
            return <p key={index}>{block.text}</p>;
        }
      })}
    </div>
  );
}
