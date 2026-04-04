import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnv, SUPABASE_ENV_HINT } from "@/lib/supabase/env";

export async function POST() {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ error: SUPABASE_ENV_HINT }, { status: 503 });
  }
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Sign out failed" }, { status: 500 });
  }
}
