import { createClient } from "@supabase/supabase-js";

// REPLACE THESE VALUES WITH YOUR SUPABASE PROJECT DETAILS
// You can find these in your Supabase project settings under API
const SUPABASE_URL = "{{SUPABASE_URL}}";
const SUPABASE_PUBLIC_KEY = "{{SUPABASE_KEY}}";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
