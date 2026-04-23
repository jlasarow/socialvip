// Stripe is not configured yet — payment processing is disabled.
// To enable payments, add your Stripe keys to .env.local and uncomment below.
// import Stripe from "stripe";
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10", typescript: true });
export const stripe = null as never;

export function formatPrice(amount: number, currency = "gbp"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}
