"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase non configurato nel deploy. Imposta NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY su Vercel e ridistribuisci."
    );
  }
  return createBrowserClient(url, key);
}
