import { describe, expect, it } from "vitest";
import { extractYoutubeId, youtubeThumbnailUrl } from "@/lib/youtube";

describe("extractYoutubeId", () => {
  it("parses a standard watch URL", () => {
    expect(extractYoutubeId("https://www.youtube.com/watch?v=sA6wi43Jj9A")).toBe("sA6wi43Jj9A");
  });

  it("parses a watch URL without www", () => {
    expect(extractYoutubeId("https://youtube.com/watch?v=sA6wi43Jj9A")).toBe("sA6wi43Jj9A");
  });

  it("parses a watch URL with extra query params", () => {
    expect(extractYoutubeId("https://www.youtube.com/watch?v=sA6wi43Jj9A&t=42s&list=abc")).toBe(
      "sA6wi43Jj9A"
    );
  });

  it("parses a youtu.be short link", () => {
    expect(extractYoutubeId("https://youtu.be/sA6wi43Jj9A")).toBe("sA6wi43Jj9A");
  });

  it("parses a youtu.be short link with a trailing query string", () => {
    expect(extractYoutubeId("https://youtu.be/sA6wi43Jj9A?t=10")).toBe("sA6wi43Jj9A");
  });

  it("parses an embed URL", () => {
    expect(extractYoutubeId("https://www.youtube.com/embed/sA6wi43Jj9A")).toBe("sA6wi43Jj9A");
  });

  it("parses a shorts URL", () => {
    expect(extractYoutubeId("https://www.youtube.com/shorts/sA6wi43Jj9A")).toBe("sA6wi43Jj9A");
  });

  it("parses a mobile (m.youtube.com) watch URL", () => {
    expect(extractYoutubeId("https://m.youtube.com/watch?v=sA6wi43Jj9A")).toBe("sA6wi43Jj9A");
  });

  it("parses a mobile youtu.be link the same as desktop", () => {
    expect(extractYoutubeId("https://m.youtu.be/sA6wi43Jj9A")).toBe("sA6wi43Jj9A");
  });

  it("accepts a bare 11-character video ID", () => {
    expect(extractYoutubeId("sA6wi43Jj9A")).toBe("sA6wi43Jj9A");
  });

  it("trims surrounding whitespace", () => {
    expect(extractYoutubeId("  sA6wi43Jj9A  ")).toBe("sA6wi43Jj9A");
  });

  it("rejects an empty string", () => {
    expect(extractYoutubeId("")).toBeNull();
  });

  it("rejects a non-YouTube URL", () => {
    expect(extractYoutubeId("https://vimeo.com/12345")).toBeNull();
  });

  it("rejects a YouTube URL with no video id", () => {
    expect(extractYoutubeId("https://www.youtube.com/@MasjidAlNoorOfficial")).toBeNull();
  });

  it("rejects a string that isn't a URL and isn't 11 characters", () => {
    expect(extractYoutubeId("not a url")).toBeNull();
  });

  it("rejects an ID-shaped string with invalid characters", () => {
    expect(extractYoutubeId("sA6wi43Jj9!")).toBeNull();
  });
});

describe("youtubeThumbnailUrl", () => {
  it("builds the predictable i.ytimg.com maxresdefault URL", () => {
    expect(youtubeThumbnailUrl("sA6wi43Jj9A")).toBe(
      "https://i.ytimg.com/vi/sA6wi43Jj9A/maxresdefault.jpg"
    );
  });
});
