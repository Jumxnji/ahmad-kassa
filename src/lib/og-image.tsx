import { ImageResponse } from "next/og";
import { emailBrand } from "@/lib/email/layout";

const { NAVY, GOLD, PAPER } = emailBrand;

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

interface RenderBrandedOgImageInput {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

/**
 * One shared branded card (navy/gold/ivory) reused by every dynamic
 * `opengraph-image.tsx` route. Deliberately uses Satori's built-in
 * system serif/sans rather than fetching Newsreader/Manrope's font
 * binaries over the network — a font fetch failing or being slow at
 * OG-render time (when a social crawler requests the image) is a
 * reliability risk not worth the typographic precision for a card
 * most people glance at for a second.
 */
export function renderBrandedOgImage({ eyebrow, title, subtitle }: RenderBrandedOgImageInput) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "88px",
          backgroundColor: NAVY,
        }}
      >
        {eyebrow && (
          <div
            style={{
              display: "flex",
              fontSize: 28,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: 28,
              fontFamily: "sans-serif",
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            display: "flex",
            fontSize: 66,
            lineHeight: 1.15,
            maxWidth: 980,
            color: PAPER,
            fontFamily: "serif",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#cec7b6",
              marginTop: 28,
              maxWidth: 880,
              fontFamily: "sans-serif",
            }}
          >
            {subtitle}
          </div>
        )}
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            alignItems: "center",
            fontSize: 26,
            color: GOLD,
            fontFamily: "serif",
          }}
        >
          Ahmad Mohamed Kassa
        </div>
      </div>
    ),
    { ...ogImageSize }
  );
}
