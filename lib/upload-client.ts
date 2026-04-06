import { CONTENT_REGISTRY } from "@/lib/content-registry";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

/**
 * Carica file su Supabase Storage dal browser (nessun limite Vercel 413).
 * Dopo l’upload salva l’URL su `site_content` via `/api/content` (stesso flusso admin).
 */
export async function uploadMediaFromBrowser(element_id: string, file: File): Promise<string> {
  const meta = CONTENT_REGISTRY.find((e) => e.element_id === element_id);
  if (!meta || (meta.content_type !== "image" && meta.content_type !== "video")) {
    throw new Error("Campo non valido per l'upload");
  }

  const supabase = createBrowserSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Sessione scaduta: accedi di nuovo");
  }

  const ext =
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    (meta.content_type === "video" ? "mp4" : "jpg");
  const safeId = element_id.replace(/[^a-z0-9._-]/gi, "_");
  const path = `${safeId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("site-media")
    .upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("site-media").getPublicUrl(path);

  const res = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      element_id,
      value: publicUrl,
      content_type: meta.content_type,
    }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error((j as { error?: string }).error ?? "Salvataggio URL fallito");
  }

  return publicUrl;
}
