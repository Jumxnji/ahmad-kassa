import "server-only";
import { ValidationError, toErrorMessage } from "@/lib/errors";
import type { ActionResultWithData } from "@/types/actions";

/**
 * Wraps a server action body so every admin action gets the same
 * try/catch → typed-error → ActionResult translation, instead of
 * repeating it in every action file. `fn` should throw (PermissionError,
 * ValidationError, NotFoundError, ...) rather than returning early —
 * this is the one place that turns a thrown error into a result the
 * client can render.
 */
export async function runAction<T>(
  fn: () => Promise<T>,
  successMessage: string
): Promise<ActionResultWithData<T>> {
  try {
    const data = await fn();
    return { success: true, message: successMessage, data };
  } catch (error) {
    console.error("[action]", error);
    if (error instanceof ValidationError) {
      return { success: false, message: error.message, fieldErrors: error.fieldErrors };
    }
    return { success: false, message: toErrorMessage(error) };
  }
}

/** Formats a Zod safeParse failure into ValidationError's fieldErrors shape. */
export function fieldErrorsFromZod(error: {
  issues: { path: PropertyKey[]; message: string }[];
}): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_root";
    out[key] ??= [];
    out[key].push(issue.message);
  }
  return out;
}
