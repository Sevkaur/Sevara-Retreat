"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { SiteContentMap } from "@/lib/site-content";
import type { SiteEditHandlers } from "@/lib/site-edit-props";

function isVideoMediaUrl(url: string): boolean {
  const path = url.split("?")[0]?.toLowerCase() ?? "";
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(path);
}

type Props = {
  id: string;
  titleKey: string;
  bodyKey: string;
  imageKeys: string[];
  content: SiteContentMap;
  variant: "light" | "pink";
  editMode?: boolean;
  edit?: SiteEditHandlers;
};

function BentoCell({
  url,
  sizes,
  minClass,
  cellKey,
  editMode,
  onUpload,
}: {
  url: string | undefined;
  sizes: string;
  minClass: string;
  cellKey: string;
  editMode?: boolean;
  onUpload?: (elementId: string, file: File) => Promise<void>;
}) {
  return (
    <div className={`relative overflow-hidden bg-neutral-200 ${minClass}`}>
      {url ? (
        isVideoMediaUrl(url) ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={url}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-hidden
          />
        ) : (
          <Image src={url} alt="" fill className="object-cover" sizes={sizes} />
        )
      ) : (
        <div className="flex h-full min-h-[inherit] w-full items-center justify-center text-xs uppercase tracking-wide text-neutral-500">
          Photo
        </div>
      )}
      {editMode && onUpload ? (
        <label className="absolute bottom-0 left-0 right-0 cursor-pointer bg-black/65 py-2 text-center font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs">
          Carica foto / video
          <input
            type="file"
            accept="image/*,video/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) await onUpload(cellKey, f);
              e.target.value = "";
            }}
          />
        </label>
      ) : null}
    </div>
  );
}

export function BentoSection({
  id,
  titleKey,
  bodyKey,
  imageKeys,
  content,
  variant,
  editMode,
  edit,
}: Props) {
  const title = content[titleKey] ?? "";
  const body = content[bodyKey] ?? "";
  const isPink = variant === "pink";
  const bg = isPink ? "bg-[#FFD1D1]" : "bg-white";
  const text = isPink ? "text-white" : "text-black";
  const headingColor = isPink ? "text-white" : "text-[#FFD1D1]";

  const cells = imageKeys.map((key) => ({
    key,
    url: content[key]?.trim(),
  }));

  const triple = cells.length === 3;
  const tc = edit?.onTextChange;
  const up = edit?.onUpload;

  const headerBlock =
    editMode && tc ? (
      <div className="mb-10 max-w-2xl">
        <textarea
          value={title}
          onChange={(e) => tc(titleKey, e.target.value)}
          rows={2}
          className={`mb-4 w-full resize-none border border-black/15 bg-transparent px-1 py-1 font-[family-name:var(--font-anton)] text-4xl uppercase leading-tight outline-none focus:border-black/30 sm:text-5xl ${headingColor}`}
        />
        <textarea
          value={body}
          onChange={(e) => tc(bodyKey, e.target.value)}
          rows={4}
          className={`w-full resize-none border border-black/15 bg-transparent px-1 py-2 font-[family-name:var(--font-inter)] text-base leading-relaxed outline-none focus:border-black/30 sm:text-lg ${text}`}
        />
      </div>
    ) : (
      <div className="mb-10 max-w-2xl">
        <h2
          className={`font-[family-name:var(--font-anton)] text-4xl uppercase leading-tight sm:text-5xl ${headingColor}`}
        >
          {title}
        </h2>
        <p className={`mt-4 font-[family-name:var(--font-inter)] text-base leading-relaxed sm:text-lg ${text}`}>
          {body}
        </p>
      </div>
    );

  return (
    <section id={id} className={`w-full scroll-mt-24 ${bg} py-16 sm:py-24`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {headerBlock}

        {triple ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {cells.map((cell, i) => (
              <ScrollReveal
                key={cell.key}
                delayMs={i * 90}
                className="min-h-0 w-full"
              >
                <BentoCell
                  url={cell.url}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  minClass="aspect-[4/5] w-full sm:aspect-[3/4]"
                  cellKey={cell.key}
                  editMode={editMode}
                  onUpload={up}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:grid-rows-2 md:gap-4">
            {cells.map((cell, i) => {
              if (i === 0) {
                return (
                  <ScrollReveal
                    key={cell.key}
                    delayMs={0}
                    className="col-span-2 row-span-2 min-h-0 md:col-span-2 md:row-span-2"
                  >
                    <BentoCell
                      url={cell.url}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      minClass="min-h-[220px] sm:min-h-[320px] h-full w-full"
                      cellKey={cell.key}
                      editMode={editMode}
                      onUpload={up}
                    />
                  </ScrollReveal>
                );
              }
              if (i === 1) {
                return (
                  <ScrollReveal
                    key={cell.key}
                    delayMs={100}
                    className="col-span-2 min-h-0 md:col-span-2 md:row-span-1"
                  >
                    <BentoCell
                      url={cell.url}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      minClass="min-h-[140px] sm:min-h-[160px] h-full w-full"
                      cellKey={cell.key}
                      editMode={editMode}
                      onUpload={up}
                    />
                  </ScrollReveal>
                );
              }
              return (
                <ScrollReveal
                  key={cell.key}
                  delayMs={140 + i * 60}
                  className="min-h-0"
                >
                  <BentoCell
                    url={cell.url}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    minClass="min-h-[140px] sm:min-h-[160px] h-full w-full"
                    cellKey={cell.key}
                    editMode={editMode}
                    onUpload={up}
                  />
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
