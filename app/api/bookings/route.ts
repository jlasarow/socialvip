import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await request.json();
  const { eventId } = body;

  if (!eventId) {
    return NextResponse.json({ error: "eventId required" }, { status: 400 });
  }

  // Check event exists and has capacity
  const { data: event } = await supabase
    .from("events_with_counts")
    .select("*")
    .eq("id", eventId)
    .eq("status", "published")
    .single();

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const spotsRemaining = event.capacity - (event.bookings_count ?? 0);
  if (spotsRemaining <= 0) {
    return NextResponse.json({ error: "Event is fully booked" }, { status: 409 });
  }

  // Check user hasn't already booked
  const { data: existing } = await supabase
    .from("bookings")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .in("status", ["confirmed", "pending"])
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Already booked" }, { status: 409 });
  }

  // Create free booking
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      event_id: eventId,
      user_id: user.id,
      status: "confirmed",
      amount_paid: 0,
      currency: event.currency,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ booking }, { status: 201 });
}
