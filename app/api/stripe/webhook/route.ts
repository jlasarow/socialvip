import { NextRequest, NextResponse } from "next/server";

// Stripe payments not configured yet.
// This endpoint will be enabled once a Stripe account is connected.
export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { error: "Payment processing not configured" },
    { status: 503 }
  );
}
