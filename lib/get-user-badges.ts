import { supabase } from "@/lib/supabaseClient";

export async function getUserBadges(): Promise<string[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("user_badges")
    .select("badge_code")
    .eq("user_id", user.id);

  if (error || !data) return [];

  return (data as { badge_code: string }[]).map((row) => row.badge_code);
}