import { createClient } from "@supabase/supabase-js";

export function getTehaloSupabase() {
  const supabaseUrl = process.env.TEHALO_SUPABASE_URL;
  const supabaseKey = process.env.TEHALO_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Faltan variables de entorno de Supabase para Tehalo");
  }

  return createClient(supabaseUrl, supabaseKey);
}
