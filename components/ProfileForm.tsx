"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Gender, Profile } from "@/types";

const INTERESTS = [
  "Art & Culture", "Food & Wine", "Travel", "Music", "Fitness & Wellness",
  "Networking", "Business", "Technology", "Fashion", "Outdoor Adventures",
  "Film & Theatre", "Literature", "Photography", "Cooking", "Sports",
];

const AVAILABILITY = [
  "Monday evenings", "Tuesday evenings", "Wednesday evenings",
  "Thursday evenings", "Friday evenings", "Saturday daytime",
  "Saturday evenings", "Sunday daytime", "Sunday evenings",
];

interface ProfileFormProps {
  profile: Profile | null;
  userId: string;
  userEmail: string;
}

export default function ProfileForm({ profile, userId, userEmail }: ProfileFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [gender, setGender] = useState<Gender>(profile?.gender ?? "prefer_not_to_say");
  const [dob, setDob] = useState(profile?.date_of_birth ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [availability, setAvailability] = useState<string[]>(profile?.availability ?? []);

  function toggle(item: string, list: string[], setter: (v: string[]) => void) {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const data = {
      user_id: userId,
      email: userEmail,
      full_name: fullName,
      gender,
      date_of_birth: dob,
      bio,
      phone,
      interests,
      availability,
      updated_at: new Date().toISOString(),
    };

    const { error } = profile
      ? await supabase.from("profiles").update(data).eq("user_id", userId)
      : await supabase.from("profiles").insert(data);

    if (error) setError(error.message);
    else setSuccess(true);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          Profile saved successfully ✓
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non_binary">Non-binary</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            placeholder="+44 7700 900000"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition resize-none"
            placeholder="Tell us about yourself…"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item, interests, setInterests)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
                interests.includes(item)
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item, availability, setAvailability)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
                availability.includes(item)
                  ? "bg-gold-500 text-white border-gold-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gold-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60"
      >
        {loading ? "Saving…" : "Save Profile"}
      </button>
    </form>
  );
}
