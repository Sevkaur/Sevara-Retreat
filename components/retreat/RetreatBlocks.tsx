"use client";

import Image from "next/image";
import { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { isVideoMediaUrl } from "@/lib/media-url";
import type { SiteContentMap } from "@/lib/site-content";
import type { SiteEditHandlers } from "@/lib/site-edit-props";

type E = { content: SiteContentMap; editMode?: boolean; edit?: SiteEditHandlers };

function fieldClass(editing: boolean) {
  return editing
    ? "w-full border border-black/15 bg-transparent px-2 py-2 outline-none focus:border-black/35"
    : "";
}

export function LeadSection({ content, editMode, edit }: E) {
  const body = content["intro.body"] ?? "";
  const tc = edit?.onTextChange;
  return (
    <section id="intro" className="w-full scroll-mt-24 bg-white py-20 sm:py-28 md:py-32">
      <ScrollReveal className="mx-auto max-w-3xl px-4 sm:px-6">
        {editMode && tc ? (
          <textarea
            value={body}
            onChange={(e) => tc("intro.body", e.target.value)}
            rows={6}
            className={`${fieldClass(true)} font-[family-name:var(--font-inter)] text-lg leading-relaxed text-black sm:text-xl`}
          />
        ) : (
          <p className="text-center font-[family-name:var(--font-inter)] text-lg leading-[1.75] text-black sm:text-xl md:leading-[1.8]">
            {body}
          </p>
        )}
      </ScrollReveal>
    </section>
  );
}

export function EmphasisBand({ content, editMode, edit }: E) {
  const title = content["quote.title"] ?? "";
  const body = content["quote.body"] ?? "";
  const tc = edit?.onTextChange;
  return (
    <section id="emphasis" className="w-full scroll-mt-24 bg-[#FFD1D1] py-20 text-white sm:py-28 md:py-32">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        {editMode && tc ? (
          <>
            <textarea
              value={title}
              onChange={(e) => tc("quote.title", e.target.value)}
              rows={2}
              className="mb-6 w-full resize-none border border-white/30 bg-white/10 px-2 py-2 text-center font-[family-name:var(--font-anton)] text-3xl uppercase leading-tight outline-none focus:border-white/50 sm:text-4xl md:text-5xl"
            />
            <textarea
              value={body}
              onChange={(e) => tc("quote.body", e.target.value)}
              rows={8}
              className="w-full resize-none border border-white/30 bg-white/10 px-3 py-3 text-left font-[family-name:var(--font-inter)] text-base leading-relaxed outline-none focus:border-white/50 sm:text-lg"
            />
          </>
        ) : (
          <>
            <h2 className="font-[family-name:var(--font-anton)] text-3xl uppercase leading-tight sm:text-4xl md:text-5xl">
              {title}
            </h2>
            <p className="mt-8 font-[family-name:var(--font-inter)] text-base leading-relaxed sm:mt-10 sm:text-lg md:text-xl">
              {body}
            </p>
          </>
        )}
      </div>
    </section>
  );
}

export function IncludedGrid({ content, editMode, edit }: E) {
  const title = content["included.title"] ?? "";
  const raw = content["included.body"] ?? "";
  const lines = raw.split("\n").map((s) => s.trim()).filter(Boolean);
  const tc = edit?.onTextChange;

  return (
    <section id="included" className="w-full scroll-mt-24 bg-white py-20 sm:py-24 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {editMode && tc ? (
          <>
            <textarea
              value={title}
              onChange={(e) => tc("included.title", e.target.value)}
              rows={2}
              className="mb-10 w-full border border-black/15 bg-transparent px-2 py-2 text-center font-[family-name:var(--font-anton)] text-3xl uppercase outline-none sm:text-4xl"
            />
            <textarea
              value={raw}
              onChange={(e) => tc("included.body", e.target.value)}
              rows={14}
              className="w-full border border-black/15 bg-transparent px-2 py-2 font-[family-name:var(--font-inter)] text-sm leading-relaxed outline-none"
              placeholder="One line per item"
            />
          </>
        ) : (
          <>
            <h2 className="text-center font-[family-name:var(--font-anton)] text-3xl uppercase leading-tight sm:text-4xl md:text-5xl md:leading-tight">
              <span className="text-[#FFD1D1]">{title}</span>
            </h2>
            <ul className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-5">
              {lines.map((line) => (
                <li
                  key={line}
                  className="flex gap-3 border-b border-black/10 pb-4 font-[family-name:var(--font-inter)] text-sm leading-relaxed text-black sm:text-base"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-black" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}

export function EditorialSplit({ content, editMode, edit }: E) {
  const [dropOver, setDropOver] = useState(false);
  const title = content["narrative.title"] ?? "";
  const body = content["narrative.body"] ?? "";
  const imageUrl = content["retreat.image"]?.trim();
  const tc = edit?.onTextChange;
  const up = edit?.onUpload;
  const clear = edit?.onClearMedia;

  const img =
    editMode && up ? (
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 sm:aspect-[3/4] ${
          dropOver ? "ring-2 ring-[#FFD1D1] ring-inset" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDropOver(true);
        }}
        onDragLeave={(e) => {
          const next = e.relatedTarget as Node | null;
          if (next && e.currentTarget.contains(next)) return;
          setDropOver(false);
        }}
        onDrop={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          setDropOver(false);
          const file = Array.from(e.dataTransfer.files).find(
            (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
          );
          if (file) await up("retreat.image", file);
        }}
      >
        {imageUrl ? (
          isVideoMediaUrl(imageUrl) ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={imageUrl}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              aria-hidden
            />
          ) : (
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 45vw"
            />
          )
        ) : (
          <div className="flex h-full min-h-[200px] w-full items-center justify-center">
            <span className="text-xs uppercase tracking-wide text-neutral-400">Immagine / video</span>
          </div>
        )}
        {imageUrl && clear ? (
          <button
            type="button"
            className="absolute left-0 top-0 z-10 bg-black/80 px-2 py-1.5 font-[family-name:var(--font-inter)] text-[9px] font-bold uppercase tracking-wide text-white hover:bg-black"
            onClick={(e) => {
              e.preventDefault();
              void clear("retreat.image");
            }}
          >
            Rimuovi
          </button>
        ) : null}
        <label className="absolute bottom-0 left-0 right-0 cursor-pointer bg-black/65 py-2 text-center font-[family-name:var(--font-inter)] text-[10px] font-bold uppercase tracking-wide text-white">
          Carica foto / video — o trascina qui
          <input
            type="file"
            accept="image/*,video/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) await up("retreat.image", f);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    ) : imageUrl ? (
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 sm:aspect-[3/4]">
        {isVideoMediaUrl(imageUrl) ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={imageUrl}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-hidden
          />
        ) : (
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 45vw"
          />
        )}
      </div>
    ) : (
      <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-neutral-100 sm:aspect-[3/4]">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Image</span>
      </div>
    );

  return (
    <section id="story" className="w-full scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:grid-cols-2 sm:gap-16 sm:px-6 md:gap-20">
        <ScrollReveal className="order-2 sm:order-1">{img}</ScrollReveal>
        <div className="order-1 flex flex-col gap-6 sm:order-2 sm:gap-8">
          {editMode && tc ? (
            <>
              <textarea
                value={title}
                onChange={(e) => tc("narrative.title", e.target.value)}
                rows={3}
                className="w-full resize-none border border-black/15 bg-transparent font-[family-name:var(--font-anton)] text-3xl uppercase leading-tight outline-none sm:text-4xl md:text-5xl"
              />
              <textarea
                value={body}
                onChange={(e) => tc("narrative.body", e.target.value)}
                rows={12}
                className="w-full resize-none border border-black/15 bg-transparent font-[family-name:var(--font-inter)] text-base leading-relaxed outline-none sm:text-lg"
              />
            </>
          ) : (
            <>
              <h2 className="font-[family-name:var(--font-anton)] text-3xl uppercase leading-[1.1] text-[#FFD1D1] sm:text-4xl md:text-5xl">
                {title}
              </h2>
              <p className="font-[family-name:var(--font-inter)] text-base leading-relaxed text-black sm:text-lg">
                {body}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export function BridgeSection({ content, editMode, edit }: E) {
  const title = content["bridge.title"] ?? "";
  const body = content["bridge.body"] ?? "";
  const tc = edit?.onTextChange;
  return (
    <section id="bridge" className="w-full scroll-mt-24 border-y border-black/5 bg-white py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        {editMode && tc ? (
          <>
            <textarea
              value={title}
              onChange={(e) => tc("bridge.title", e.target.value)}
              rows={2}
              className="mb-4 w-full border border-black/15 bg-transparent text-center font-[family-name:var(--font-anton)] text-2xl uppercase outline-none sm:text-3xl"
            />
            <textarea
              value={body}
              onChange={(e) => tc("bridge.body", e.target.value)}
              rows={5}
              className="w-full border border-black/15 bg-transparent text-center font-[family-name:var(--font-inter)] text-base outline-none sm:text-lg"
            />
          </>
        ) : (
          <>
            <h2 className="font-[family-name:var(--font-anton)] text-2xl uppercase leading-tight text-black sm:text-3xl md:text-4xl">
              {title}
            </h2>
            <p className="mt-6 font-[family-name:var(--font-inter)] text-base leading-relaxed text-black/85 sm:mt-8 sm:text-lg">
              {body}
            </p>
          </>
        )}
      </div>
    </section>
  );
}

export function OutcomesGrid({ content, editMode, edit }: E) {
  const tc = edit?.onTextChange;
  const items = [1, 2, 3] as const;
  return (
    <section id="outcomes" className="w-full scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-6 md:gap-10">
          {items.map((n, i) => {
            const tk = `outcome.${n}.title`;
            const bk = `outcome.${n}.body`;
            const t = content[tk] ?? "";
            const b = content[bk] ?? "";
            return (
              <ScrollReveal key={n} delayMs={i * 100} className="flex flex-col border border-black/10 bg-white p-6 sm:p-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center bg-black font-[family-name:var(--font-inter)] text-sm font-bold text-white">
                  {n}
                </div>
                {editMode && tc ? (
                  <>
                    <textarea
                      value={t}
                      onChange={(e) => tc(tk, e.target.value)}
                      rows={2}
                      className="mb-3 w-full border border-black/15 bg-transparent font-[family-name:var(--font-anton)] text-xl uppercase outline-none"
                    />
                    <textarea
                      value={b}
                      onChange={(e) => tc(bk, e.target.value)}
                      rows={6}
                      className="w-full border border-black/15 bg-transparent font-[family-name:var(--font-inter)] text-sm leading-relaxed outline-none"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="font-[family-name:var(--font-anton)] text-xl uppercase leading-tight text-[#FFD1D1] sm:text-2xl">
                      {t}
                    </h3>
                    <p className="mt-4 font-[family-name:var(--font-inter)] text-sm leading-relaxed text-black sm:text-base">
                      {b}
                    </p>
                  </>
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HostsBlock({ content, editMode, edit }: E) {
  const title = content["hosts.title"] ?? "";
  const body = content["hosts.body"] ?? "";
  const tc = edit?.onTextChange;
  return (
    <section id="hosts" className="w-full scroll-mt-24 bg-[#FFD1D1] py-20 text-white sm:py-28 md:py-32">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        {editMode && tc ? (
          <>
            <textarea
              value={title}
              onChange={(e) => tc("hosts.title", e.target.value)}
              rows={2}
              className="mb-6 w-full border border-white/30 bg-white/10 px-2 py-2 text-center font-[family-name:var(--font-anton)] text-3xl uppercase outline-none sm:text-4xl"
            />
            <textarea
              value={body}
              onChange={(e) => tc("hosts.body", e.target.value)}
              rows={10}
              className="w-full border border-white/30 bg-white/10 px-3 py-3 text-left font-[family-name:var(--font-inter)] text-base leading-relaxed outline-none sm:text-lg"
            />
          </>
        ) : (
          <>
            <h2 className="font-[family-name:var(--font-anton)] text-3xl uppercase leading-tight sm:text-4xl md:text-5xl">
              {title}
            </h2>
            <p className="mt-8 font-[family-name:var(--font-inter)] text-base leading-relaxed sm:mt-10 sm:text-lg md:text-xl">
              {body}
            </p>
          </>
        )}
      </div>
    </section>
  );
}

export function ClosingStrip({ content, editMode, edit }: E) {
  const line = content["closing.line"] ?? "";
  const tc = edit?.onTextChange;
  return (
    <section className="w-full bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        {editMode && tc ? (
          <input
            value={line}
            onChange={(e) => tc("closing.line", e.target.value)}
            className="w-full border border-black/15 bg-transparent text-center font-[family-name:var(--font-anton)] text-3xl uppercase outline-none sm:text-4xl md:text-5xl"
          />
        ) : (
          <p className="font-[family-name:var(--font-anton)] text-3xl uppercase tracking-wide text-[#FFD1D1] sm:text-4xl md:text-5xl">
            {line}
          </p>
        )}
      </div>
    </section>
  );
}
