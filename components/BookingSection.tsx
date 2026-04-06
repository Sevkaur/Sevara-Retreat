"use client";

import type { SiteContentMap } from "@/lib/site-content";
import type { SiteEditHandlers } from "@/lib/site-edit-props";
import { Button } from "@/components/ui/Button";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfqFJsJCKVy6tWE2dFjCgd8WL2OI2LU3O_kJg7vNTry7NCm9A/viewform";

type Props = {
  id: string;
  content: SiteContentMap;
  editMode?: boolean;
  edit?: SiteEditHandlers;
};

function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          part
        )
      )}
    </>
  );
}

export function BookingSection({ id, content, editMode, edit }: Props) {
  const title = content["booking.title"] ?? "";
  const body = content["booking.body"] ?? "";
  const cta = content["booking.cta"] ?? "";
  const tc = edit?.onTextChange;

  return (
    <section id={id} className="w-full scroll-mt-24 bg-[#FFD1D1] py-20 sm:py-28">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-4 sm:px-6">
        {editMode && tc ? (
          <>
            <textarea
              value={title}
              onChange={(e) => tc("booking.title", e.target.value)}
              rows={2}
              className="w-full resize-none border border-white/30 bg-transparent px-1 py-1 font-[family-name:var(--font-anton)] text-[4.5rem] uppercase leading-none text-white outline-none focus:border-white/60 sm:text-[6rem]"
            />
            <textarea
              value={body}
              onChange={(e) => tc("booking.body", e.target.value)}
              rows={5}
              className="w-full resize-none border border-white/30 bg-transparent px-1 py-2 font-[family-name:var(--font-inter)] text-lg leading-relaxed text-white outline-none focus:border-white/60 sm:text-xl"
            />
            <span className="font-[family-name:var(--font-inter)] text-[10px] text-white/50">
              Usa **testo** per il grassetto
            </span>
            <label className="flex w-full max-w-md flex-col gap-1 font-[family-name:var(--font-inter)] text-xs uppercase tracking-wide text-white/80">
              Testo pulsante
              <input
                type="text"
                value={cta}
                onChange={(e) => tc("booking.cta", e.target.value)}
                className="border-0 bg-black px-8 py-4 text-xl font-bold uppercase tracking-wide text-white outline-none ring-2 ring-white/30 focus:ring-white/60"
              />
            </label>
          </>
        ) : (
          <>
            <h2 className="font-[family-name:var(--font-anton)] text-[4.5rem] uppercase leading-none text-white sm:text-[6rem]">
              {title}
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-lg leading-relaxed text-white sm:text-xl">
              <Rich text={body} />
            </p>
            <Button
              href={GOOGLE_FORM_URL}
              className="px-10 py-5 text-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {cta}
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
