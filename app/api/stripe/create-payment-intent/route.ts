import { NextResponse } from "next/server";

// Stripe payments are not configured yet.
// When you're ready, add your Stripe keys to .env.local and restore the full
// implementation from git history (git show HEAD:app/api/stripe/create-payment-intent/route.ts).
export async function POST() {
  return NextResponse.json(
    { error: "Payments are not yet enabled." },
    { status: 503 }
  );
}
