"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Event } from "@/types";

interface BookingButtonProps {
  event: Event;
  user: { id: string; email?: string } | null;
  existingBooking: { id: string; status: string } | null;
  isFull: boolean;
}

export default function BookingButton({
  event,
  user,
  existingBooking,
  isFull,
}: BookingButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleBook() {
    if (!user) {
      router.push(`/login?redirectTo=/events/${event.id}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Book directly — payment processing coming soon
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      router.push(`/bookings?success=true`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (existingBooking) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center">
        <p className="text-green-700 font-semibold text-sm">✓ You&apos;re booked!</p>
        <p className="text-green-600 text-xs mt-0.5">
          Status: {existingBooking.status}
        </p>
      </div>
    );
  }

  if (isFull) {
    return (
      <button
        disabled
        className="w-full bg-gray-100 text-gray-400 font-semibold py-3 rounded-xl cursor-not-allowed"
      >
        Sold Out
      </button>
    );
  }

  return (
    <div>
      {error && (
        <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
      )}
      <button
        onClick={handleBook}
        disabled={loading}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Processing…" : "Reserve Spot"}
      </button>
    </div>
  );
}
