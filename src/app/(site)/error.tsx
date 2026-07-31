"use client";

import { useEffect } from "react";
import { Section } from "@/components/shared/section";
import { ErrorState } from "@/components/shared/error-state";

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
    <Section containerWidth="content" className="text-center">
      <ErrorState onRetry={reset} />
    </Section>
  );
}
