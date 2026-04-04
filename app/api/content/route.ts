import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CONTENT_REGISTRY, defaultContentMap } from "@/lib/content-registry";
import { createAnonClient } from "@/lib/supabase/anon";
import { isAllowedAdminEmail } from "@/lib/admin-allowlist";
import { hasSupabaseEnv, SUPABASE_ENV_HINT } from "@/lib/supabase/env";

export async function GET() {
  const base = defaultContentMap();
  const supabase = createAnonClient();
  if (!supabase) {
    return NextResponse.json({ content: base });
  }
  const { data, error } = await supabase.from("site_content").select("element_id, value");
  if (error || !data) {
    return NextResponse.json({ content: base });
  }
  const merged = { ...base };
  for (const row of data) {
    if (row.element_id && typeof row.value === "string") {
      merged[row.element_id] = row.value;
    }
  }
  return NextResponse.json({ content: merged });
}

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ error: SUPABASE_ENV_HINT }, { status: 503 });
  }
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isAllowedAdminEmail(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const element_id = body.element_id as string | undefined;
    const value = (body.value ?? "") as string;
    const content_type = body.content_type as string | undefined;

    if (!element_id || !content_type) {
      return NextResponse.json(
        { error: "element_id and content_type required" },
        { status: 400 }
      );
    }

    const allowed = CONTENT_REGISTRY.find((e) => e.element_id === element_id);
    if (!allowed || allowed.content_type !== content_type) {
      return NextResponse.json({ error: "Invalid element" }, { status: 400 });
    }

    const { error } = await supabase.from("site_content").upsert(
      {
        element_id,
        content_type,
        value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "element_id" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    if (msg.includes("Missing Supabase")) {
      return NextResponse.json({ error: SUPABASE_ENV_HINT }, { status: 503 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
