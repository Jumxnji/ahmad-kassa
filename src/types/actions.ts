export type ActionResult =
  | { readonly success: true; readonly message: string }
  | { readonly success: false; readonly message: string };

/**
 * Same shape as ActionResult, plus an optional payload — used by
 * admin actions that need to hand something back to the client
 * (e.g. a newly created record's id) beyond a toast message.
 */
export type ActionResultWithData<T> =
  | { readonly success: true; readonly message: string; readonly data: T }
  | { readonly success: false; readonly message: string; readonly fieldErrors?: Record<string, string[]> };
