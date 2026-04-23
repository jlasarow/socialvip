"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Gender } from "@/types";

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

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Step 1 — account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2 — profile
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<Gender>("prefer_not_to_say");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);

  function toggleItem(
    item: string,
    list: string[],
    setter: (v: string[]) => void
  ) {
    setter(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message || "Sign-up failed.");
      setLoading(false);
      return;
    }

    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: data.user.id,
      email,
      full_name: fullName,
      gender,
      date_of_birth: dob,
      bio,
      phone,
      interests: selectedInterests,
      availability: selectedAvailability,
    });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    router.push("/events?welcome=true");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold gradient-text">
            SocialVIP
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            {step === 1 ? "Create your account" : "Build your profile"}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Step {step} of 2</p>
          {/* Progress */}
          <div className="flex gap-2 justify-center mt-3">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-16 rounded-full transition-colors ${
                  s <= step ? "bg-brand-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                  placeholder="Min. 8 characters"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Continue →
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Gender
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                      .toISOString()
                      .split("T")[0]}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                    placeholder="+44 7700 900000"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Bio (optional)
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition resize-none"
                    placeholder="Tell us a little about yourself…"
                  />
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests (pick all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() =>
                        toggleItem(interest, selectedInterests, setSelectedInterests)
                      }
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border ${
                        selectedInterests.includes(interest)
                          ? "bg-brand-600 text-white border-brand-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  When are you typically available?
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABILITY.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() =>
                        toggleItem(slot, selectedAvailability, setSelectedAvailability)
                      }
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border ${
                        selectedAvailability.includes(slot)
                          ? "bg-gold-500 text-white border-gold-500"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gold-300"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60"
                >
                  {loading ? "Creating account…" : "Join SocialVIP 🎉"}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already a member?{" "}
          <Link href="/login" className="text-brand-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
