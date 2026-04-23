import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
      <p className="text-gray-500 mb-8">
        Keep your profile up to date so we can recommend the best events for you.
      </p>
      <ProfileForm profile={profile} userId={user.id} userEmail={user.email ?? ""} />
    </div>
  );
}
