import { createClient } from "@/lib/supabase/server";
import EventCard from "@/components/EventCard";
import { Event } from "@/types";

export const revalidate = 60;

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events_with_counts")
    .select("*")
    .eq("status", "published")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Upcoming Events
        </h1>
        <p className="text-gray-500 text-lg">
          Exclusive experiences curated for SocialVIP members.
        </p>
      </div>

      {!events || events.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-6xl mb-4">🎭</div>
          <p className="text-xl font-medium">No upcoming events yet.</p>
          <p className="text-sm mt-2">Check back soon — great things are coming.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(events as Event[]).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
