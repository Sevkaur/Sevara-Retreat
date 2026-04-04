"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { SiteContentMap } from "@/lib/site-content";
import type { SiteEditHandlers } from "@/lib/site-edit-props";

type Variant = "light" | "pink";

type Props = {
  id: string;
  titleKey: string;
  bodyKey: string;
  imageKey?: string;
  content: SiteContentMap;
  variant: Variant;
  imagePosition?: "left" | "right";
  editMode?: boolean;
  edit?: SiteEditHandlers;
};

export function FeatureSection({
  id,
  titleKey,
  bodyKey,
  imageKey,
  content,
  variant,
  imagePosition = "right",
  editMode,
  edit,
}: Props) {
  const title = content[titleKey] ?? "";
  const body = content[bodyKey] ?? "";
  const imageUrl = imageKey ? content[imageKey]?.trim() : "";

  const isPink = variant === "pink";
  const bg = isPink ? "bg-[#FFD1D1]" : "bg-white";
  const text = isPink ? "text-white" : "text-black";
  const headingColor = isPink ? "text-white" : "text-[#FFD1D1]";

  const tc = edit?.onTextChange;

  const imageBlock =
    imageKey && imageUrl ? (
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5 sm:aspect-[16/10]">
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {editMode && imageKey && edit?.onUpload ? (
          <label className="absolute bottom-0 left-0 right-0 cursor-pointer bg-black/70 py-2 text-center font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-wide text-white">
            Carica immagine
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) await edit.onUpload(imageKey, f);
                e.target.value = "";
              }}
            />
          </label>
        ) : null}
      </div>
    ) : imageKey ? (
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200 sm:aspect-[16/10]">
        {editMode && imageKey && edit?.onUpload ? (
          <label className="flex h-full min-h-[200px] w-full cursor-pointer flex-col items-center justify-center gap-2 px-4 text-center font-[family-name:var(--font-inter)] text-xs uppercase tracking-wide text-neutral-600">
            <span>Carica immagine</span>
            <input
              type="file"
              accept="image/*"
              className="max-w-full text-[10px]"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) await edit.onUpload(imageKey, f);
                e.target.value = "";
              }}
            />
          </label>
        ) : null}
      </div>
    ) : null;

  const textColumn = editMode && tc ? (
    <div
      className={`flex flex-col gap-4 ${imagePosition === "left" && imageBlock ? "sm:order-2" : ""}`}
    >
      <textarea
        value={title}
        onChange={(e) => tc(titleKey, e.target.value)}
        rows={2}
        className={`w-full resize-none border border-black/20 bg-transparent px-1 py-1 font-[family-name:var(--font-anton)] text-4xl uppercase leading-tight outline-none focus:border-black/40 sm:text-5xl ${headingColor}`}
      />
      <textarea
        value={body}
        onChange={(e) => tc(bodyKey, e.target.value)}
        rows={5}
        className={`w-full resize-none border border-black/20 bg-transparent px-1 py-2 font-[family-name:var(--font-inter)] text-base leading-relaxed outline-none focus:border-black/40 sm:text-lg ${text}`}
      />
    </div>
  ) : (
    <div
      className={`flex flex-col gap-4 ${imagePosition === "left" && imageBlock ? "sm:order-2" : ""}`}
    >
      <h2
        className={`font-[family-name:var(--font-anton)] text-4xl uppercase leading-tight sm:text-5xl ${headingColor}`}
      >
        {title}
      </h2>
      <p className={`font-[family-name:var(--font-inter)] text-base leading-relaxed sm:text-lg ${text}`}>
        {body}
      </p>
    </div>
  );

  return (
    <section id={id} className={`w-full scroll-mt-24 ${bg} py-16 sm:py-24`}>
      <div
        className={`mx-auto grid max-w-6xl gap-10 px-4 sm:items-center sm:gap-14 sm:px-6 ${
          imageBlock ? "sm:grid-cols-2" : "max-w-3xl"
        }`}
      >
        {textColumn}
        {imageBlock ? (
          <div className={imagePosition === "left" ? "sm:order-1" : ""}>
            <ScrollReveal className="h-full w-full">{imageBlock}</ScrollReveal>
          </div>
        ) : null}
      </div>
    </section>
  );
}
