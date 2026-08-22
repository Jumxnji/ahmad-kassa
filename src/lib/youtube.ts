const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/**
 * Accepts a pasted YouTube URL (watch/short/embed link) or a bare
 * 11-character video ID, and returns the video ID or `null` if nothing
 * valid can be parsed. Pure/local — no network request, no API key.
 */
export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (YOUTUBE_ID_PATTERN.test(trimmed)) return trimmed;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return YOUTUBE_ID_PATTERN.test(id) ? id : null;
  }

  if (host === "youtube.com") {
    const v = url.searchParams.get("v");
    if (v && YOUTUBE_ID_PATTERN.test(v)) return v;

    const match = url.pathname.match(/^\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})/);
    if (match) return match[1];
  }

  return null;
}

/**
 * YouTube's own predictable thumbnail host/path — the same one this
 * project's real khutbah thumbnails already hotlink from (Sprint 18).
 * No API call, no key.
 */
export function youtubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}
