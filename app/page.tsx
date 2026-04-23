import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative gradient-brand text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-6xl mx-auto px-6 py-32 text-center">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            Members Only
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome to{" "}
            <span className="text-gold-400">SocialVIP</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10">
            Discover exclusive events curated for discerning members. Book your
            place and connect with like-minded people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                href="/events"
                className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-xl"
              >
                Browse Events
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-xl"
                >
                  Join the Club
                </Link>
                <Link
                  href="/login"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full text-lg transition-all border border-white/30"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -top-16 -right-16 w-96 h-96 bg-white/5 rounded-full" />
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Why join <span className="gradient-text">SocialVIP</span>?
        </h2>
        <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
          We carefully curate events and members to ensure every experience is
          exceptional.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "🎭",
              title: "Exclusive Events",
              body: "From intimate dinners to cultural experiences — every event is hand-picked for our members.",
            },
            {
              icon: "👥",
              title: "Curated Community",
              body: "Meet professionals and creatives who share your interests and passion for great experiences.",
            },
            {
              icon: "✨",
              title: "Seamless Booking",
              body: "See available spots in real-time, book in seconds, and pay securely through Stripe.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-900 text-white py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">
            Ready to experience more?
          </h2>
          <p className="text-white/70 mb-8">
            Membership is free to join. Events are priced individually.
          </p>
          <Link
            href="/register"
            className="inline-block bg-gold-500 hover:bg-gold-600 text-white font-semibold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-xl"
          >
            Create Your Profile
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} SocialVIP. All rights reserved.</p>
      </footer>
    </main>
  );
}
