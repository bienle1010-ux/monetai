import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export interface RegistrationRecord {
  id?: number;
  name: string;
  email: string;
  plan: string;
  joined_at: string;
  ip?: string;
}
