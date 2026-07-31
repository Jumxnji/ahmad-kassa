/**
 * Payments architecture — types only. Stripe is not wired into any
 * checkout flow yet; this contract lets future book/course purchase
 * UI be built without guessing at shapes later.
 */

export type Currency = "usd" | "gbp" | "eur";

export type PurchasableKind = "book" | "course" | "digital-product";

export interface PriceInfo {
  readonly amountCents: number;
  readonly currency: Currency;
  readonly interval?: "one-time" | "month" | "year";
}

export interface CheckoutItem {
  readonly kind: PurchasableKind;
  readonly referenceId: string;
  readonly title: string;
  readonly price: PriceInfo;
}

export interface CheckoutSessionRequest {
  readonly items: readonly CheckoutItem[];
  readonly successPath: string;
  readonly cancelPath: string;
  readonly customerEmail?: string;
}
