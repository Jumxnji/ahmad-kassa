"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/error-state";

export default function AdminError({
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
    <ErrorState
      title="This page ran into a problem"
      description="Try again, or head back to the dashboard overview."
      onRetry={reset}
      className="mt-6"
    />
  );
}
