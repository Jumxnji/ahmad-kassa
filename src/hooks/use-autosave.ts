"use client";

import { useEffect, useRef, useState } from "react";

export type AutosaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

interface UseAutosaveOptions<T> {
  value: T;
  onSave: (value: T) => Promise<{ success: boolean }>;
  delay?: number;
  enabled?: boolean;
}

/**
 * Debounced autosave: watches `value` (typically `useWatch({ control })`
 * from react-hook-form), and calls `onSave` a beat after the user stops
 * typing. Keeps `onSave` in a ref so callers don't need to memoize it —
 * only `value`/`enabled`/`delay` changes drive the effect.
 */
export function useAutosave<T>({ value, onSave, delay = 1500, enabled = true }: UseAutosaveOptions<T>) {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string | null>(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    const serialized = JSON.stringify(value);

    if (isFirstRun.current) {
      isFirstRun.current = false;
      lastSavedRef.current = serialized;
      return;
    }

    if (!enabled || serialized === lastSavedRef.current) return;

    setStatus("pending");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setStatus("saving");
      try {
        const result = await onSaveRef.current(value);
        if (result.success) {
          lastSavedRef.current = serialized;
          setStatus("saved");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, enabled, delay]);

  return status;
}
