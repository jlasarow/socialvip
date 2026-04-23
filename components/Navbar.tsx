"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  user: { email?: string } | null;
  isAdmin?: boolean;
}

export default function Navbar({ user, isAdmin }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl gradient-text">
          SocialVIP
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/events"
            className="text-gray-600 hover:text-brand-600 font-medium transition-colors"
          >
            Events
          </Link>
          {user && (
            <>
              <Link
                href="/bookings"
                className="text-gray-600 hover:text-brand-600 font-medium transition-colors"
              >
                My Bookings
              </Link>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-brand-600 font-medium transition-colors"
              >
                Profile
              </Link>
            </>
          )}
          {isAdmin && (
            <Link
              href="/admin/events"
              className="text-brand-600 hover:text-brand-700 font-semibold transition-colors"
            >
              Admin ✦
            </Link>
          )}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-brand-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all"
              >
                Join
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span
              className={`block w-6 h-0.5 bg-gray-700 transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-700 transition-opacity ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-700 transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          <Link href="/events" className="block text-gray-700 font-medium py-1">
            Events
          </Link>
          {user && (
            <>
              <Link href="/bookings" className="block text-gray-700 font-medium py-1">
                My Bookings
              </Link>
              <Link href="/profile" className="block text-gray-700 font-medium py-1">
                Profile
              </Link>
            </>
          )}
          {isAdmin && (
            <Link href="/admin/events" className="block text-brand-600 font-semibold py-1">
              Admin ✦
            </Link>
          )}
          {user ? (
            <button
              onClick={handleSignOut}
              className="block text-gray-500 font-medium py-1"
            >
              Sign Out
            </button>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="text-gray-600 font-medium">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-brand-600 text-white font-semibold px-4 py-1.5 rounded-full text-sm"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
