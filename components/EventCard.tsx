import Link from "next/link";
import Image from "next/image";
import { Event } from "@/types";
import { formatPrice } from "@/lib/stripe";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const spotsRemaining = event.capacity - (event.bookings_count ?? 0);
  const isFull = spotsRemaining <= 0;
  const isLow = spotsRemaining > 0 && spotsRemaining <= 5;

  const eventDate = new Date(event.event_date);

  return (
    <Link
      href={`/events/${event.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-brand-500 to-brand-700 overflow-hidden">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
            🎭
          </div>
        )}
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 font-bold text-sm px-3 py-1.5 rounded-full shadow">
          {event.price === 0 ? "Free" : formatPrice(event.price, event.currency)}
        </div>
        {/* Spots badge */}
        {isFull ? (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            Sold Out
          </div>
        ) : isLow ? (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            {spotsRemaining} left!
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Date & Location */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
          <span className="flex items-center gap-1">
            📅{" "}
            {eventDate.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1 truncate">
            📍 {event.location}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">
          {event.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {event.short_description}
        </p>

        {/* Capacity bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{event.bookings_count ?? 0} booked</span>
            <span>{spotsRemaining} spots left</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isFull
                  ? "bg-red-400"
                  : isLow
                    ? "bg-orange-400"
                    : "bg-brand-500"
              }`}
              style={{
                width: `${Math.min(100, ((event.bookings_count ?? 0) / event.capacity) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
