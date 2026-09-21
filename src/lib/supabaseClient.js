import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY — copy .env.example to .env.local and fill them in."
  );
}

// Publishable/anon key only — safe to expose client-side. RLS on
// public.resources grants it read-only access (see the
// create_resources_table migration); there is no public write path.
export const supabase = createClient(supabaseUrl, supabaseKey);
