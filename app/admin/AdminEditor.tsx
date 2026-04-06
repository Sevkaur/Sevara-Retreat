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
  ClosingStrip,
} from "@/components/retreat/RetreatBlocks";
import { BentoSection } from "@/components/BentoSection";
import { BookingSection } from "@/components/BookingSection";
import { Footer } from "@/components/Footer";
import { CONTENT_REGISTRY, EXTRAS_ROOM_IMAGE_KEYS, type ContentEntry } from "@/lib/content-registry";
import type { SiteContentMap } from "@/lib/site-content";
import type { SiteEditHandlers } from "@/lib/site-edit-props";
import { uploadMediaFromBrowser } from "@/lib/upload-client";

type Props = {
  initialContent: SiteContentMap;
};

function AdminContentHint({ title, where }: { title: string; where: string }) {
  return (
    <div className="rounded-lg border border-black/10 bg-neutral-100/95 px-4 py-3 sm:px-5">
      <p className="font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">
        {title}
      </p>
      <p className="mt-1.5 font-[family-name:var(--font-inter)] text-xs leading-relaxed text-black/80">{where}</p>
    </div>
  );
}

function AdminSectionHintRow({ title, where }: { title: string; where: string }) {
  return (
    <div className="w-full border-y border-black/[0.06] bg-neutral-50/95">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <AdminContentHint title={title} where={where} />
      </div>
    </div>
  );
}

function AdminEditBanner() {
  return (
    <div className="sticky top-0 z-[200] border-b border-black/10 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <p className="font-[family-name:var(--font-inter)] text-sm leading-relaxed text-black/90">
          <span className="font-semibold">Modifica contenuti</span> — questa è la{" "}
          <span className="font-semibold">stessa pagina</span> della home pubblica: stesso ordine e stessi blocchi.
          Quello che salvi qui è ciò che vedono i visitatori. La{" "}
          <span className="font-semibold">barra in basso</span> (stato / Esci) non esiste sul sito pubblico.
        </p>
        <p className="mt-2 font-[family-name:var(--font-inter)] text-xs leading-relaxed text-black/55">
          I riquadri grigi spiegano dove compare ogni sezione online. Per foto e video, ogni zona indica il punto esatto
          in pagina.
        </p>
      </div>
    </div>
  );
}

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
        <span className="max-w-[min(100%,28rem)] text-black/60 sm:max-w-none">
          Solo admin: salvataggio automatico · pubblico aggiornato subito
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
      <AdminEditBanner />
      <main className="flex flex-1 flex-col">
        <Hero content={content} editMode edit={edit} />
        <AdminSectionHintRow
          title="Paragrafo introduttivo"
          where="Sotto la hero, testo centrato a colonna singola su sfondo bianco — primo blocco di lettura dopo il video."
        />
        <LeadSection content={content} editMode edit={edit} />
        <AdminSectionHintRow
          title="Fascia enfasi (messaggio forte)"
          where="Banda rosa pastello a tutta larghezza: titolo + testo lungo. Separa visivamente intro e resto pagina."
        />
        <EmphasisBand content={content} editMode edit={edit} />
        <AdminSectionHintRow
          title="Elenco incluso"
          where="Sezione bianca con titolo e lista puntata (su desktop due colonne)."
        />
        <IncludedGrid content={content} editMode edit={edit} />
        <AdminSectionHintRow
          title="Storia + media (anchor #story)"
          where="Due colonne: grande immagine o video a sinistra, titolo e testo a destra. Il menu «Retreat» punta qui."
        />
        <EditorialSplit content={content} editMode edit={edit} />
        <AdminSectionHintRow
          title="Ponte / contesto"
          where="Blocco centrale bianco tra gallerie: titolo + breve testo (es. ambientazione)."
        />
        <BridgeSection content={content} editMode edit={edit} />
        <AdminSectionHintRow
          title="Galleria accommodation (3 riquadri)"
          where="Tre colonne su desktop: sinistra, centro, destra. Ogni file occupa solo quel riquadro."
        />
        <BentoSection
          id="accommodation"
          titleKey="accommodation.title"
          bodyKey="accommodation.body"
          imageKeys={[
            "accommodation.bento_1",
            "accommodation.bento_2",
            "accommodation.bento_3",
          ]}
          cellSlotLabels={[
            "Riquadro sinistra (16:9 mobile)",
            "Riquadro centro",
            "Riquadro destra (foto o video)",
          ]}
          cellMobileAspects={["aspect-video", "aspect-[4/5]", "aspect-[4/5]"]}
          content={content}
          variant="pink"
          editMode
          edit={edit}
        />
        <AdminSectionHintRow
          title="The Rooms — swipe laterale (fino a 50 immagini)"
          where="Scorrimento orizzontale: fino a 50 slot foto; le immagini appaiono alla dimensione naturale. Carica nell'ordine desiderato (Foto 1 … Foto 50)."
        />
        <BentoSection
          id="extras"
          titleKey="extras.title"
          bodyKey="extras.body"
          imageKeys={[...EXTRAS_ROOM_IMAGE_KEYS]}
          cellSlotLabels={EXTRAS_ROOM_IMAGE_KEYS.map((_, i) =>
            i === 0
              ? "Foto 1 (prima a sinistra)"
              : i === EXTRAS_ROOM_IMAGE_KEYS.length - 1
                ? `Foto ${i + 1} (ultima a destra)`
                : `Foto ${i + 1}`
          )}
          content={content}
          variant="light"
          swipeLayout
          largeHeading
          editMode
          edit={edit}
        />
        <AdminSectionHintRow
          title="Tre esiti numerati"
          where="Tre card in riga (su mobile impilate): numero, titolo, testo."
        />
        <OutcomesGrid content={content} editMode edit={edit} />
        <AdminSectionHintRow
          title="Chiusura prima del booking"
          where="Riga grande centrata su bianco, sopra la prenotazione."
        />
        <ClosingStrip content={content} editMode edit={edit} />
        <AdminSectionHintRow
          title="Booking + testo pulsante CTA"
          where="Titolo, testo e bottone. Il testo del bottone è lo stesso della hero. Anchor #booking."
        />
        <BookingSection id="booking" content={content} editMode edit={edit} />
        <AdminSectionHintRow
          title="Footer"
          where="Piè di pagina: tagline, email, riga legale."
        />
      </main>
      <Footer content={content} editMode edit={edit} />
    </div>
  );
}
