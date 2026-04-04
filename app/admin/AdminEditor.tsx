"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CONTENT_REGISTRY, type ContentEntry } from "@/lib/content-registry";
import type { SiteContentMap } from "@/lib/site-content";

type Props = {
  initialContent: SiteContentMap;
};

async function saveText(element_id: string, value: string, content_type: ContentEntry["content_type"]) {
  const res = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ element_id, value, content_type }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error ?? "Save failed");
  }
}

async function uploadFile(element_id: string, file: File) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("element_id", element_id);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j.error ?? "Upload failed");
  return j.url as string;
}

export function AdminEditor({ initialContent }: Props) {
  const [content, setContent] = useState<SiteContentMap>(initialContent);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleSave(
    element_id: string,
    value: string,
    content_type: ContentEntry["content_type"]
  ) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setStatus("Saving…");
      setError(null);
      try {
        await saveText(element_id, value, content_type);
        setStatus("Saved");
        setTimeout(() => setStatus(null), 1500);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
        setStatus(null);
      }
    }, 450);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/content");
        const j = await res.json();
        if (!cancelled && j.content) setContent(j.content);
      } catch {
        /* keep initial */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const entries = useMemo(() => CONTENT_REGISTRY, []);

  async function signOut() {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-anton)] text-3xl uppercase text-[#FFD1D1]">
            Site content
          </h1>
          <p className="mt-1 font-[family-name:var(--font-inter)] text-sm text-black/70">
            Changes sync to Supabase. The public site revalidates about every minute.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="self-start border border-black bg-white px-4 py-2 text-sm font-bold uppercase text-black"
        >
          Sign out
        </button>
      </div>

      {(status || error) && (
        <p
          className={`mt-4 text-sm ${error ? "text-red-700" : "text-black/70"}`}
          role="status"
        >
          {error ?? status}
        </p>
      )}

      <ul className="mt-10 flex flex-col gap-10">
        {entries.map((entry) => (
          <li key={entry.element_id} className="border-b border-black/10 pb-10">
            <p className="font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-wide text-black/60">
              {entry.label}
            </p>
            <p className="mt-1 font-mono text-xs text-black/40">{entry.element_id}</p>

            {entry.content_type === "text" || entry.content_type === "video" ? (
              <textarea
                className="mt-3 min-h-[88px] w-full border border-black px-3 py-2 font-[family-name:var(--font-inter)] text-sm"
                value={content[entry.element_id] ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setContent((prev) => ({ ...prev, [entry.element_id]: v }));
                  scheduleSave(entry.element_id, v, entry.content_type);
                }}
                placeholder={entry.default_value}
              />
            ) : (
              <div className="mt-3 flex flex-col gap-3">
                {content[entry.element_id] ? (
                  <p className="break-all text-xs text-black/70">{content[entry.element_id]}</p>
                ) : null}
                <input
                  type="file"
                  accept={entry.content_type === "image" ? "image/*" : "image/*,video/*"}
                  className="text-sm"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setStatus("Uploading…");
                    setError(null);
                    try {
                      const url = await uploadFile(entry.element_id, file);
                      setContent((prev) => ({ ...prev, [entry.element_id]: url }));
                      setStatus("Saved");
                      setTimeout(() => setStatus(null), 1500);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Upload failed");
                      setStatus(null);
                    } finally {
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
