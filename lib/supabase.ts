// lib/supabase.ts
// Supabase client instances.
// supabaseAdmin uses the service role key — server-side ONLY.
// Never import supabaseAdmin from a "use client" file.

import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL!
const anonKey = process.env.SUPABASE_ANON_KEY!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Browser-safe client (anon key) — for public reads if ever needed
export const supabaseClient = createClient(url, anonKey)

// Server-only admin client (service role key) — bypasses RLS
// Only import this in route handlers and server components
export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false },
})
