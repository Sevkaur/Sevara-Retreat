import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CONTENT_REGISTRY } from "@/lib/content-registry";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const element_id = formData.get("element_id") as string | null;

    if (!file || !element_id) {
      return NextResponse.json(
        { error: "file and element_id required" },
        { status: 400 }
      );
    }

    const meta = CONTENT_REGISTRY.find((e) => e.element_id === element_id);
    if (!meta || (meta.content_type !== "image" && meta.content_type !== "video")) {
      return NextResponse.json({ error: "Invalid element" }, { status: 400 });
    }

    const ext =
      file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
      (meta.content_type === "video" ? "mp4" : "jpg");
    const safeId = element_id.replace(/[^a-z0-9._-]/gi, "_");
    const path = `${safeId}/${Date.now()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from("site-media")
      .upload(path, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("site-media").getPublicUrl(path);

    const { error: dbError } = await supabase.from("site_content").upsert(
      {
        element_id,
        content_type: meta.content_type,
        value: publicUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "element_id" }
    );

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ url: publicUrl });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
