import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/stripe";
import { Booking } from "@/types";

export default async function BookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, event:events(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
      <p className="text-gray-500 mb-8">All your past and upcoming event bookings.</p>

      {!bookings || bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🎫</div>
          <p className="text-xl font-medium">No bookings yet</p>
          <p className="text-sm mt-2">
            Browse{" "}
            <Link href="/events" className="text-brand-600 hover:underline">
              upcoming events
            </Link>{" "}
            to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {(bookings as Booking[]).map((booking) => {
            const event = booking.event;
            if (!event) return null;
            const eventDate = new Date(event.event_date);
            const isUpcoming = eventDate > new Date();
            const statusColors: Record<string, string> = {
              confirmed: "bg-green-100 text-green-700",
              pending: "bg-yellow-100 text-yellow-700",
              cancelled: "bg-red-100 text-red-600",
              refunded: "bg-gray-100 text-gray-600",
            };

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[booking.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    {isUpcoming && (
                      <span className="text-xs bg-brand-50 text-brand-600 font-medium px-2.5 py-1 rounded-full">
                        Upcoming
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {event.title}
                  </h3>
                  <div className="text-sm text-gray-400 mt-0.5 space-y-0.5">
                    <p>
                      📅{" "}
                      {eventDate.toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p>📍 {event.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-lg">
                    {booking.amount_paid === 0
                      ? "Free"
                      : formatPrice(booking.amount_paid, booking.currency)}
                  </p>
                  <Link
                    href={`/events/${event.id}`}
                    className="text-sm text-brand-600 hover:underline mt-1 inline-block"
                  >
                    View event →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
