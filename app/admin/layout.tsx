import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/events");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} isAdmin={true} />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-100 px-4 py-8 hidden md:block">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Admin
          </p>
          <nav className="space-y-1">
            <Link
              href="/admin/events"
              className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              Events
            </Link>
            <Link
              href="/admin/bookings"
              className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              Bookings
            </Link>
            <Link
              href="/admin/members"
              className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              Members
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
