"use client";

import Image from "next/image";
import { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { isVideoMediaUrl } from "@/lib/media-url";
import type { SiteContentMap } from "@/lib/site-content";
import type { SiteEditHandlers } from "@/lib/site-edit-props";

type Props = {
  id: string;
  titleKey: string;
  bodyKey: string;
  imageKeys: string[];
  /** In admin: etichetta per ogni cella (ordine = posizione in grid pubblica). */
  cellSlotLabels?: string[];
  /** Override mobile aspect per ogni cella nel layout triple (es. ["aspect-video","aspect-[4/5]","aspect-[4/5]"]). */
  cellMobileAspects?: string[];
  /** Se true usa layout orizzontale a swipe con immagini a dimensioni naturali. */
  swipeLayout?: boolean;
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
  onClearMedia,
  slotLabel,
}: {
  url: string | undefined;
  sizes: string;
  minClass: string;
  cellKey: string;
  editMode?: boolean;
  onUpload?: (elementId: string, file: File) => Promise<void>;
  onClearMedia?: (elementId: string) => Promise<void>;
  slotLabel?: string;
}) {
  const [dropOver, setDropOver] = useState(false);
  const editable = Boolean(editMode && onUpload);

  return (
    <div
      className={`relative overflow-hidden bg-neutral-200 ${minClass} ${
        editable && dropOver ? "ring-2 ring-[#FFD1D1] ring-inset" : ""
      }`}
      onDragOver={
        editable
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
            }
          : undefined
      }
      onDragEnter={
        editable
          ? (e) => {
              e.preventDefault();
              setDropOver(true);
            }
          : undefined
      }
      onDragLeave={
        editable
          ? (e) => {
              const next = e.relatedTarget as Node | null;
              if (next && e.currentTarget.contains(next)) return;
              setDropOver(false);
            }
          : undefined
      }
      onDrop={
        editable && onUpload
          ? async (e) => {
              e.preventDefault();
              e.stopPropagation();
              setDropOver(false);
              const file = Array.from(e.dataTransfer.files).find(
                (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
              );
              if (file) await onUpload(cellKey, file);
            }
          : undefined
      }
    >
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
      {editable && slotLabel ? (
        <span className="absolute right-0 top-0 z-[6] max-w-[min(100%,12rem)] bg-black/75 px-2 py-1 text-right font-[family-name:var(--font-inter)] text-[9px] font-semibold leading-tight text-white/95">
          {slotLabel}
        </span>
      ) : null}
      {editable && url && onClearMedia ? (
        <button
          type="button"
          className="absolute left-0 top-0 z-[5] bg-black/80 px-2 py-1.5 font-[family-name:var(--font-inter)] text-[9px] font-bold uppercase tracking-wide text-white hover:bg-black"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void onClearMedia(cellKey);
          }}
        >
          Rimuovi
        </button>
      ) : null}
      {editable && onUpload ? (
        <label className="absolute bottom-0 left-0 right-0 cursor-pointer bg-black/65 py-2 text-center font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs">
          Carica foto / video — o trascina qui
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

/** Cell per layout swipe: immagine/video alla sua dimensione naturale (altezza fissa, larghezza auto). */
function SwipeCell({
  url,
  cellKey,
  editMode,
  onUpload,
  onClearMedia,
  slotLabel,
}: {
  url: string | undefined;
  cellKey: string;
  editMode?: boolean;
  onUpload?: (elementId: string, file: File) => Promise<void>;
  onClearMedia?: (elementId: string) => Promise<void>;
  slotLabel?: string;
}) {
  const [dropOver, setDropOver] = useState(false);
  const editable = Boolean(editMode && onUpload);
  const SWIPE_H = "h-[260px] sm:h-[340px]";

  return (
    <div
      className={`relative shrink-0 snap-start overflow-hidden bg-neutral-200 ${
        url ? "" : "w-[220px]"
      } ${SWIPE_H} ${editable && dropOver ? "ring-2 ring-[#FFD1D1] ring-inset" : ""}`}
      onDragOver={
        editable
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
            }
          : undefined
      }
      onDragEnter={
        editable
          ? (e) => {
              e.preventDefault();
              setDropOver(true);
            }
          : undefined
      }
      onDragLeave={
        editable
          ? (e) => {
              const next = e.relatedTarget as Node | null;
              if (next && e.currentTarget.contains(next)) return;
              setDropOver(false);
            }
          : undefined
      }
      onDrop={
        editable && onUpload
          ? async (e) => {
              e.preventDefault();
              e.stopPropagation();
              setDropOver(false);
              const file = Array.from(e.dataTransfer.files).find(
                (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
              );
              if (file) await onUpload(cellKey, file);
            }
          : undefined
      }
    >
      {url ? (
        isVideoMediaUrl(url) ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            className={`${SWIPE_H} w-auto`}
            src={url}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-hidden
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className={`${SWIPE_H} w-auto`}
            style={{ display: "block" }}
          />
        )
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-wide text-neutral-500">
          {slotLabel ?? "Photo"}
        </div>
      )}
      {editable && slotLabel ? (
        <span className="absolute right-0 top-0 z-[6] max-w-[min(100%,12rem)] bg-black/75 px-2 py-1 text-right font-[family-name:var(--font-inter)] text-[9px] font-semibold leading-tight text-white/95">
          {slotLabel}
        </span>
      ) : null}
      {editable && url && onClearMedia ? (
        <button
          type="button"
          className="absolute left-0 top-0 z-[5] bg-black/80 px-2 py-1.5 font-[family-name:var(--font-inter)] text-[9px] font-bold uppercase tracking-wide text-white hover:bg-black"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void onClearMedia(cellKey);
          }}
        >
          Rimuovi
        </button>
      ) : null}
      {editable && onUpload ? (
        <label className="absolute bottom-0 left-0 right-0 cursor-pointer bg-black/65 py-2 text-center font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs">
          Carica foto / video — o trascina qui
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
  cellSlotLabels,
  cellMobileAspects,
  swipeLayout,
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

  const triple = cells.length === 3 && !swipeLayout;
  const tc = edit?.onTextChange;
  const up = edit?.onUpload;
  const clear = edit?.onClearMedia;

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

        {swipeLayout ? (
          /* Horizontal swipe — immagini a dimensioni naturali */
          <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
            <div className="flex snap-x snap-mandatory gap-3 pb-3 sm:gap-4">
              {cells.map((cell, i) => (
                <SwipeCell
                  key={cell.key}
                  url={cell.url}
                  cellKey={cell.key}
                  editMode={editMode}
                  onUpload={up}
                  onClearMedia={clear}
                  slotLabel={cellSlotLabels?.[i]}
                />
              ))}
            </div>
          </div>
        ) : triple ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {cells.map((cell, i) => {
              const mobileAspect = cellMobileAspects?.[i] ?? "aspect-[4/5]";
              return (
                <ScrollReveal
                  key={cell.key}
                  delayMs={i * 90}
                  className="min-h-0 w-full"
                >
                  <BentoCell
                    url={cell.url}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    minClass={`${mobileAspect} w-full sm:aspect-[3/4]`}
                    cellKey={cell.key}
                    editMode={editMode}
                    onUpload={up}
                    onClearMedia={clear}
                    slotLabel={cellSlotLabels?.[i]}
                  />
                </ScrollReveal>
              );
            })}
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
                      onClearMedia={clear}
                      slotLabel={cellSlotLabels?.[i]}
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
                      onClearMedia={clear}
                      slotLabel={cellSlotLabels?.[i]}
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
                    onClearMedia={clear}
                    slotLabel={cellSlotLabels?.[i]}
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
