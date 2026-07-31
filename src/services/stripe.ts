import "server-only";
import Stripe from "stripe";

/**
 * Stripe is prepared but not integrated into any purchase flow yet —
 * courses, books, and digital products are not for sale. This client
 * is lazily instantiated so the app can build and run without a
 * STRIPE_SECRET_KEY set.
 */
let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Payments are not enabled yet."
    );
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2026-07-29.dahlia",
    });
  }

  return stripeClient;
}
