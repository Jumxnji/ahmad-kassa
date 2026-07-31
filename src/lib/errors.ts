/**
 * Reusable, typed error hierarchy for the dashboard. Server actions
 * catch these and translate them into the appropriate `ActionResult`
 * (see src/types/actions.ts) or, for route-level errors, Next.js
 * renders the nearest error.tsx / not-found.tsx boundary.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class PermissionError extends AppError {
  constructor(message = "You don't have permission to do that.") {
    super(message, "PERMISSION_DENIED");
    this.name = "PermissionError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found.`, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(
    message = "Please check the form and try again.",
    public readonly fieldErrors?: Record<string, string[]>
  ) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "That value is already in use.") {
    super(message, "CONFLICT");
    this.name = "ConflictError";
  }
}

/** Narrow an unknown catch-block value into a user-facing message. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
