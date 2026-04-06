"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { SiteContentMap } from "@/lib/site-content";
import type { SiteEditHandlers } from "@/lib/site-edit-props";
import { Button } from "@/components/ui/Button";

type Props = {
  content: SiteContentMap;
  editMode?: boolean;
  edit?: SiteEditHandlers;
};

function fileLabelFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname.split("/").pop() ?? url;
    return path.length > 36 ? `${path.slice(0, 34)}…` : path;
  } catch {
    const seg = url.split("/").pop() ?? url;
    return seg.length > 36 ? `${seg.slice(0, 34)}…` : seg;
  }
}

export function Hero({ content, editMode, edit }: Props) {
  const eyebrow = content["hero.eyebrow"] ?? "";
  const dateLine = content["hero.date"] ?? "";
  const title = content["hero.title"] ?? "";
  const subtitle = content["hero.subtitle"] ?? "";
  const videoUrl = content["hero.video"]?.trim();
  const posterUrl = content["hero.poster"]?.trim();
  const cta = content["booking.cta"] ?? "";
  const tc = edit?.onTextChange;

  const shell =
    "relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-black px-4 pb-24 pt-24 sm:px-6 sm:pb-32 sm:pt-28 motion-safe:transition-[opacity,transform] duration-700";

  const videoBg = (
    <div className="absolute inset-0 z-0">
      {videoUrl ? (
        <video
          className="h-full w-full scale-105 object-cover"
          src={videoUrl}
          poster={posterUrl || undefined}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-[#FFD1D1]/35 via-black to-black" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)]" />
    </div>
  );

  const center = "relative z-10 flex w-full max-w-4xl flex-col items-center text-center";

  const up = edit?.onUpload;
  const clear = edit?.onClearMedia;
  const fieldId = useId();
  const videoInputId = `${fieldId}-video`;
  const posterInputId = `${fieldId}-poster`;
  const [videoOver, setVideoOver] = useState(false);
  const [posterOver, setPosterOver] = useState(false);

  if (editMode && tc) {
    return (
      <section className={shell}>
        {videoBg}
        <div className={`${center} gap-6`}>
          <input
            value={eyebrow}
            onChange={(e) => tc("hero.eyebrow", e.target.value)}
            className="w-full max-w-md border border-white/25 bg-black/40 px-3 py-2 text-center font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.4em] text-white outline-none"
          />
          <input
            value={dateLine}
            onChange={(e) => tc("hero.date", e.target.value)}
            className="w-full max-w-md border border-white/25 bg-black/40 px-3 py-2 text-center font-[family-name:var(--font-inter)] text-sm text-white/90 outline-none"
          />
          <textarea
            value={title}
            onChange={(e) => tc("hero.title", e.target.value)}
            rows={2}
            className="w-full resize-none border border-white/25 bg-black/40 px-2 py-2 text-center font-[family-name:var(--font-anton)] text-[clamp(2rem,8vw,4.5rem)] uppercase leading-[1.02] text-[#FFD1D1] outline-none"
          />
          <textarea
            value={subtitle}
            onChange={(e) => tc("hero.subtitle", e.target.value)}
            rows={4}
            className="w-full max-w-2xl resize-none border border-white/25 bg-black/40 px-3 py-3 text-center font-[family-name:var(--font-inter)] text-base leading-relaxed text-white/95 outline-none sm:text-lg"
          />
          {up ? (
            <div className="w-full max-w-2xl rounded border border-white/20 bg-black/55 p-4 text-left">
              <p className="mb-4 font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-wide text-white/55">
                Media — salvataggio su Supabase Storage
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                <div
                  className={`flex min-h-[140px] min-w-0 flex-1 flex-col rounded-lg border-2 border-dashed px-3 py-4 transition-colors ${
                    videoOver
                      ? "border-[#FFD1D1] bg-white/10"
                      : "border-white/25 bg-black/40"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setVideoOver(true);
                  }}
                  onDragLeave={(e) => {
                    const next = e.relatedTarget as Node | null;
                    if (next && e.currentTarget.contains(next)) return;
                    setVideoOver(false);
                  }}
                  onDrop={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setVideoOver(false);
                    const file = Array.from(e.dataTransfer.files).find((f) =>
                      f.type.startsWith("video/")
                    );
                    if (file) await up("hero.video", file);
                  }}
                >
                  <input
                    id={videoInputId}
                    type="file"
                    accept="video/*"
                    className="sr-only"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) await up("hero.video", f);
                      e.target.value = "";
                    }}
                  />
                  <label
                    htmlFor={videoInputId}
                    className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 text-center"
                  >
                    <span className="font-[family-name:var(--font-inter)] text-sm font-semibold text-white">
                      Carica video
                    </span>
                    <span className="font-[family-name:var(--font-inter)] text-[11px] leading-snug text-white/55">
                      Trascina qui il file oppure clicca per selezionare
                    </span>
                  </label>
                  {videoUrl ? (
                    <>
                      <p
                        className="mt-2 truncate text-center font-[family-name:var(--font-inter)] text-[10px] text-[#FFD1D1]/90"
                        title={videoUrl}
                      >
                        {fileLabelFromUrl(videoUrl)}
                      </p>
                      {clear ? (
                        <button
                          type="button"
                          className="mt-2 font-[family-name:var(--font-inter)] text-[10px] font-semibold uppercase tracking-wide text-white/70 underline decoration-white/30 underline-offset-2 hover:text-white"
                          onClick={() => void clear("hero.video")}
                        >
                          Rimuovi video
                        </button>
                      ) : null}
                    </>
                  ) : null}
                </div>

                <div
                  className={`flex min-h-[140px] min-w-0 flex-1 flex-col rounded-lg border-2 border-dashed px-3 py-4 transition-colors ${
                    posterOver
                      ? "border-[#FFD1D1] bg-white/10"
                      : "border-white/25 bg-black/40"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setPosterOver(true);
                  }}
                  onDragLeave={(e) => {
                    const next = e.relatedTarget as Node | null;
                    if (next && e.currentTarget.contains(next)) return;
                    setPosterOver(false);
                  }}
                  onDrop={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPosterOver(false);
                    const file = Array.from(e.dataTransfer.files).find((f) =>
                      f.type.startsWith("image/")
                    );
                    if (file) await up("hero.poster", file);
                  }}
                >
                  <input
                    id={posterInputId}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) await up("hero.poster", f);
                      e.target.value = "";
                    }}
                  />
                  <label
                    htmlFor={posterInputId}
                    className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 text-center"
                  >
                    <span className="font-[family-name:var(--font-inter)] text-sm font-semibold text-white">
                      Carica foto
                    </span>
                    <span className="font-[family-name:var(--font-inter)] text-[11px] leading-snug text-white/55">
                      Trascina qui il file oppure clicca per selezionare
                    </span>
                  </label>
                  {posterUrl ? (
                    <>
                      <div className="relative mx-auto mt-2 h-20 w-32 overflow-hidden rounded border border-white/25">
                        <Image src={posterUrl} alt="" fill className="object-cover" sizes="128px" />
                      </div>
                      {clear ? (
                        <button
                          type="button"
                          className="mt-2 font-[family-name:var(--font-inter)] text-[10px] font-semibold uppercase tracking-wide text-white/70 underline decoration-white/30 underline-offset-2 hover:text-white"
                          onClick={() => void clear("hero.poster")}
                        >
                          Rimuovi foto
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <p className="mt-2 text-center font-[family-name:var(--font-inter)] text-[10px] text-white/35">
                      Opzionale — anteprima mentre il video carica
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          <p className="text-[10px] text-white/40">CTA: modifica nella sezione Booking</p>
        </div>
      </section>
    );
  }

  return (
    <section className={shell}>
      {videoBg}
      <div className={`${center} gap-5 sm:gap-7`}>
        <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.42em] text-white/85 sm:text-[11px]">
          {eyebrow}
        </p>
        <p className="font-[family-name:var(--font-inter)] text-sm text-white/80 sm:text-base">{dateLine}</p>
        <h1 className="max-w-[18ch] font-[family-name:var(--font-anton)] text-[clamp(2.25rem,9vw,5rem)] uppercase leading-[0.98] text-[#FFD1D1]">
          {title}
        </h1>
        <p className="max-w-2xl font-[family-name:var(--font-inter)] text-base leading-relaxed text-white/95 sm:text-lg md:text-xl">
          {subtitle}
        </p>
        <div className="mt-4 sm:mt-6">
          <Button href="#booking">{cta || "COUNT ME IN"}</Button>
        </div>
      </div>
    </section>
  );
}
