"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import {
  LeadSection,
  EmphasisBand,
  IncludedGrid,
  EditorialSplit,
  BridgeSection,
  OutcomesGrid,
  HostsBlock,
  ClosingStrip,
} from "@/components/retreat/RetreatBlocks";
import { BentoSection } from "@/components/BentoSection";
import { BookingSection } from "@/components/BookingSection";
import { Footer } from "@/components/Footer";
import { CONTENT_REGISTRY, type ContentEntry } from "@/lib/content-registry";
import type { SiteContentMap } from "@/lib/site-content";
import type { SiteEditHandlers } from "@/lib/site-edit-props";
import { uploadMediaFromBrowser } from "@/lib/upload-client";

type Props = {
  initialContent: SiteContentMap;
};

async function saveText(
  element_id: string,
  value: string,
  content_type: ContentEntry["content_type"]
) {
  const res = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ element_id, value, content_type }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error((j as { error?: string }).error ?? "Save failed");
  }
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
      setStatus("Salvataggio…");
      setError(null);
      try {
        await saveText(element_id, value, content_type);
        setStatus("Salvato");
        setTimeout(() => setStatus(null), 2000);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Errore salvataggio");
        setStatus(null);
      }
    }, 450);
  }

  const onTextChange: SiteEditHandlers["onTextChange"] = (elementId, value) => {
    setContent((prev) => ({ ...prev, [elementId]: value }));
    const entry = CONTENT_REGISTRY.find((e) => e.element_id === elementId);
    if (entry) scheduleSave(elementId, value, entry.content_type);
  };

  const onUpload: SiteEditHandlers["onUpload"] = async (elementId, file) => {
    setStatus("Caricamento…");
    setError(null);
    try {
      const url = await uploadMediaFromBrowser(elementId, file);
      setContent((prev) => ({ ...prev, [elementId]: url }));
      setStatus("Salvato · aggiornato anche sul sito pubblico");
      setTimeout(() => setStatus(null), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload fallito");
      setStatus(null);
    }
  };

  const onClearMedia: NonNullable<SiteEditHandlers["onClearMedia"]> = async (elementId) => {
    const entry = CONTENT_REGISTRY.find((e) => e.element_id === elementId);
    if (!entry || (entry.content_type !== "image" && entry.content_type !== "video")) return;
    setStatus("Rimozione…");
    setError(null);
    try {
      await saveText(elementId, "", entry.content_type);
      setContent((prev) => ({ ...prev, [elementId]: "" }));
      setStatus("Rimosso · aggiornato anche sul sito pubblico");
      setTimeout(() => setStatus(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore rimozione");
      setStatus(null);
    }
  };

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

  async function signOut() {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  }

  const edit: SiteEditHandlers = { onTextChange, onUpload, onClearMedia };

  return (
    <div className="flex min-h-full flex-col pb-24">
      <div className="fixed bottom-0 left-0 right-0 z-[300] flex items-center justify-between gap-3 border-t border-black bg-white/95 px-4 py-3 font-[family-name:var(--font-inter)] text-sm shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:px-6">
        <span className="text-black/60">
          Salvataggio su Supabase · il sito pubblico si aggiorna dopo ogni modifica
        </span>
        <div className="flex items-center gap-3">
          {(status || error) && (
            <span
              className={error ? "max-w-[50vw] truncate text-red-700" : "text-black/70"}
              role="status"
            >
              {error ?? status}
            </span>
          )}
          <button
            type="button"
            onClick={() => void signOut()}
            className="border border-black bg-black px-4 py-2 text-xs font-bold uppercase tracking-wide text-white"
          >
            Esci
          </button>
        </div>
      </div>

      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero content={content} editMode edit={edit} />
        <LeadSection content={content} editMode edit={edit} />
        <EmphasisBand content={content} editMode edit={edit} />
        <IncludedGrid content={content} editMode edit={edit} />
        <EditorialSplit content={content} editMode edit={edit} />
        <BridgeSection content={content} editMode edit={edit} />
        <BentoSection
          id="accommodation"
          titleKey="accommodation.title"
          bodyKey="accommodation.body"
          imageKeys={[
            "accommodation.bento_1",
            "accommodation.bento_2",
            "accommodation.bento_3",
          ]}
          content={content}
          variant="pink"
          editMode
          edit={edit}
        />
        <BentoSection
          id="extras"
          titleKey="extras.title"
          bodyKey="extras.body"
          imageKeys={[
            "extras.bento_1",
            "extras.bento_2",
            "extras.bento_3",
            "extras.bento_4",
          ]}
          content={content}
          variant="light"
          editMode
          edit={edit}
        />
        <OutcomesGrid content={content} editMode edit={edit} />
        <HostsBlock content={content} editMode edit={edit} />
        <ClosingStrip content={content} editMode edit={edit} />
        <BookingSection id="booking" content={content} editMode edit={edit} />
      </main>
      <Footer content={content} editMode edit={edit} />
    </div>
  );
}
