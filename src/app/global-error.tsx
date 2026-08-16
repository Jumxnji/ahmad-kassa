"use client";

import { useEffect } from "react";

/**
 * Last-resort fallback for an error thrown by the root layout itself
 * (fonts, providers) — not the `(site)`/`admin` error boundaries,
 * which handle everything else. Next.js requires this file to render
 * its own <html>/<body> since if the root layout failed, nothing
 * above this can be trusted to still work — so it's deliberately
 * self-contained (inline styles, no imports from the app) rather than
 * reusing Section/ErrorState.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "24px",
          textAlign: "center",
          fontFamily: "-apple-system, Helvetica, Arial, sans-serif",
          backgroundColor: "#faf8f3",
          color: "#17181c",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 500 }}>
          Something went wrong
        </h1>
        <p style={{ margin: 0, maxWidth: "28rem", color: "#706c63", lineHeight: 1.6 }}>
          The page couldn&rsquo;t load. Please try again, or come back in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "8px",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid #e2dccb",
            backgroundColor: "#faf8f3",
            color: "#17181c",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
