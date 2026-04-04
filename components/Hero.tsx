"use client";

import type { SiteContentMap } from "@/lib/site-content";
import type { SiteEditHandlers } from "@/lib/site-edit-props";
import { Button } from "@/components/ui/Button";

type Props = {
  content: SiteContentMap;
  editMode?: boolean;
  edit?: SiteEditHandlers;
};

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
          <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-1 text-left font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-wide text-white/60">
              Video URL
              <input
                type="url"
                value={content["hero.video"] ?? ""}
                onChange={(e) => tc("hero.video", e.target.value)}
                className="border border-white/25 bg-black/50 px-2 py-2 text-xs text-white"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-left font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-wide text-white/60">
              Poster URL
              <input
                type="url"
                value={content["hero.poster"] ?? ""}
                onChange={(e) => tc("hero.poster", e.target.value)}
                className="border border-white/25 bg-black/50 px-2 py-2 text-xs text-white"
              />
            </label>
          </div>
          <label className="cursor-pointer text-xs text-white/70 underline">
            Carica poster
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f && edit?.onUpload) await edit.onUpload("hero.poster", f);
                e.target.value = "";
              }}
            />
          </label>
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
