/**
 * Brand marks are not part of lucide-react, so minimal outline
 * glyphs are hand-drawn here to match the icon system's stroke
 * weight and stay swappable per platform.
 */

export function YoutubeIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function InstagramIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-2.6-2.4h-2.98v12.55a2.5 2.5 0 1 1-1.77-2.39v-3.03a5.51 5.51 0 1 0 4.75 5.46V9.1a7.24 7.24 0 0 0 4.2 1.34V7.46a4.28 4.28 0 0 1-1.6-.3 4.3 4.3 0 0 1 0-1.34Z" />
    </svg>
  );
}
