"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CreateEventForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    short_description: "",
    description: "",
    event_date: "",
    event_end_date: "",
    location: "",
    location_details: "",
    capacity: "20",
    price: "0",
    currency: "gbp",
    image_url: "",
    tags: "",
    status: "published",
  });

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not authenticated"); setLoading(false); return; }

    const tags = form.tags
      ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const { error } = await supabase.from("events").insert({
      title: form.title,
      short_description: form.short_description,
      description: form.description,
      event_date: form.event_date,
      event_end_date: form.event_end_date || null,
      location: form.location,
      location_details: form.location_details || null,
      capacity: parseInt(form.capacity),
      price: Math.round(parseFloat(form.price) * 100), // convert to pence
      currency: form.currency,
      image_url: form.image_url || null,
      tags,
      status: form.status,
      created_by: user.id,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setForm({
        title: "", short_description: "", description: "", event_date: "",
        event_end_date: "", location: "", location_details: "", capacity: "20",
        price: "0", currency: "gbp", image_url: "", tags: "", status: "published",
      });
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          Event created successfully ✓
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Title *
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputClass}
            placeholder="e.g. Wine Tasting Evening"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Short Description * (shown on event card)
          </label>
          <input
            type="text"
            required
            value={form.short_description}
            onChange={(e) => set("short_description", e.target.value)}
            className={inputClass}
            placeholder="One sentence teaser…"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Full Description *
          </label>
          <textarea
            required
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Detailed event description…"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Date & Time *
          </label>
          <input
            type="datetime-local"
            required
            value={form.event_date}
            onChange={(e) => set("event_date", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            End Date & Time (optional)
          </label>
          <input
            type="datetime-local"
            value={form.event_end_date}
            onChange={(e) => set("event_end_date", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Location *
          </label>
          <input
            type="text"
            required
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            className={inputClass}
            placeholder="e.g. Mayfair, London"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Location Details (optional)
          </label>
          <input
            type="text"
            value={form.location_details}
            onChange={(e) => set("location_details", e.target.value)}
            className={inputClass}
            placeholder="Venue name, floor, etc."
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Capacity *
          </label>
          <input
            type="number"
            required
            min="1"
            value={form.capacity}
            onChange={(e) => set("capacity", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Price (£) — enter 0 for free
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            className={inputClass}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Image URL (optional)
          </label>
          <input
            type="url"
            value={form.image_url}
            onChange={(e) => set("image_url", e.target.value)}
            className={inputClass}
            placeholder="https://…"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            className={inputClass}
            placeholder="Wine, Networking, Social"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className={inputClass}
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all disabled:opacity-60 text-sm"
      >
        {loading ? "Creating…" : "Create Event"}
      </button>
    </form>
  );
}
