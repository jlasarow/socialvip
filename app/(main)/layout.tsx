import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .single();
    isAdmin = data?.is_admin ?? false;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} isAdmin={isAdmin} />
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
        © {new Date().getFullYear()} SocialVIP. All rights reserved.
      </footer>
    </div>
  );
}
