import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes HTML produced by the dashboard's RichTextEditor (Tiptap)
 * before it's persisted — defense in depth even though only
 * authenticated dashboard users can author this content.
 */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "strong", "em", "u", "ul", "ol", "li", "blockquote", "h2", "h3", "br"],
    allowedAttributes: {},
    disallowedTagsMode: "discard",
  });
}
