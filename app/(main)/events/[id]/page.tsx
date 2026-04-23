import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BookingButton from "@/components/BookingButton";
import { formatPrice } from "@/lib/stripe";
import { Event } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events_with_counts")
    .select("*")
    .eq("id", id)
    .single();

  if (!event) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user has already booked
  let existingBooking = null;
  if (user) {
    const { data } = await supabase
      .from("bookings")
      .select("id, status")
      .eq("event_id", id)
      .eq("user_id", user.id)
      .in("status", ["confirmed", "pending"])
      .maybeSingle();
    existingBooking = data;
  }

  const e = event as Event;
  const spotsRemaining = e.capacity - (e.bookings_count ?? 0);
  const isFull = spotsRemaining <= 0;
  const eventDate = new Date(e.event_date);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-600 mb-8 transition-colors"
      >
        ← Back to Events
      </Link>

      {/* Hero image */}
      <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 mb-8">
        {e.image_url && (
          <Image src={e.image_url} alt={e.title} fill className="object-cover" />
        )}
        {!e.image_url && (
          <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20">
            🎭
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2">
          {/* Tags */}
          {e.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {e.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs bg-brand-50 text-brand-600 px-3 py-1 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {e.title}
          </h1>
          <p className="text-gray-500 text-lg mb-6 leading-relaxed">
            {e.short_description}
          </p>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {e.description}
            </p>
          </div>
        </div>

        {/* Booking card */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 sticky top-24">
            {/* Price */}
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {e.price === 0
                ? "Free"
                : formatPrice(e.price, e.currency)}
            </div>
            <p className="text-gray-400 text-sm mb-5">per person</p>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-lg">📅</span>
                <div>
                  <div className="font-medium">
                    {eventDate.toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-gray-400">
                    {eventDate.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-lg">📍</span>
                <div>
                  <div className="font-medium">{e.location}</div>
                  {e.location_details && (
                    <div className="text-gray-400">{e.location_details}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-lg">👥</span>
                <div>
                  <span className="font-medium">{spotsRemaining}</span> of{" "}
                  {e.capacity} spots remaining
                </div>
              </div>
            </div>

            {/* Capacity bar */}
            <div className="mb-6">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isFull
                      ? "bg-red-400"
                      : spotsRemaining <= 5
                        ? "bg-orange-400"
                        : "bg-brand-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      ((e.bookings_count ?? 0) / e.capacity) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Booking button */}
            <BookingButton
              event={e}
              user={user}
              existingBooking={existingBooking}
              isFull={isFull}
            />

            {!user && (
              <p className="text-center text-xs text-gray-400 mt-3">
                <Link href="/login" className="text-brand-600 hover:underline">
                  Sign in
                </Link>{" "}
                or{" "}
                <Link href="/register" className="text-brand-600 hover:underline">
                  join
                </Link>{" "}
                to book
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
