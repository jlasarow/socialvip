import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatPrice } from "@/lib/stripe";
import CreateEventForm from "@/components/CreateEventForm";
import { Event } from "@/types";

export default async function AdminEventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events_with_counts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 text-sm mt-1">
            Create and manage all club events.
          </p>
        </div>
      </div>

      {/* Create form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          Create New Event
        </h2>
        <CreateEventForm />
      </div>

      {/* Events table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3.5 text-left font-semibold text-gray-600">
                Event
              </th>
              <th className="px-5 py-3.5 text-left font-semibold text-gray-600">
                Date
              </th>
              <th className="px-5 py-3.5 text-left font-semibold text-gray-600">
                Price
              </th>
              <th className="px-5 py-3.5 text-left font-semibold text-gray-600">
                Bookings
              </th>
              <th className="px-5 py-3.5 text-left font-semibold text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(events as Event[])?.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <Link
                    href={`/events/${event.id}`}
                    className="font-medium text-gray-900 hover:text-brand-600"
                  >
                    {event.title}
                  </Link>
                  <p className="text-gray-400 text-xs mt-0.5">{event.location}</p>
                </td>
                <td className="px-5 py-4 text-gray-600">
                  {new Date(event.event_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-4 text-gray-600">
                  {event.price === 0
                    ? "Free"
                    : formatPrice(event.price, event.currency)}
                </td>
                <td className="px-5 py-4 text-gray-600">
                  {event.bookings_count ?? 0} / {event.capacity}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      event.status === "published"
                        ? "bg-green-100 text-green-700"
                        : event.status === "draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-600"
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!events || events.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            No events yet. Create your first one above.
          </div>
        )}
      </div>
    </div>
  );
}
