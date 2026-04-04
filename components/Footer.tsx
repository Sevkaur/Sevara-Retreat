"use client";

import type { SiteContentMap } from "@/lib/site-content";
import type { SiteEditHandlers } from "@/lib/site-edit-props";

type Props = {
  content: SiteContentMap;
  editMode?: boolean;
  edit?: SiteEditHandlers;
};

export function Footer({ content, editMode, edit }: Props) {
  const tagline = content["footer.tagline"] ?? "";
  const email = content["footer.email"] ?? "";
  const tc = edit?.onTextChange;

  return (
    <footer className="w-full border-t border-black/10 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6">
        {editMode && tc ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <input
              type="text"
              value={tagline}
              onChange={(e) => tc("footer.tagline", e.target.value)}
              className="w-full max-w-md border border-black/15 bg-transparent px-1 py-1 font-[family-name:var(--font-anton)] text-xl uppercase tracking-wide text-[#FFD1D1] outline-none focus:border-black/30"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => tc("footer.email", e.target.value)}
              className="w-full max-w-md border border-black/15 bg-transparent px-1 py-2 font-[family-name:var(--font-inter)] text-sm text-black outline-none focus:border-black/30"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <p className="font-[family-name:var(--font-anton)] text-xl uppercase tracking-wide text-[#FFD1D1]">
              {tagline}
            </p>
            <a
              href={`mailto:${email}`}
              className="font-[family-name:var(--font-inter)] text-sm text-black underline-offset-4 hover:underline"
            >
              {email}
            </a>
          </div>
        )}
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-black/10 pt-6 font-[family-name:var(--font-inter)] text-xs uppercase tracking-wide text-black/50">
          <span>Terms &amp; Support</span>
          <span>Privacy</span>
        </div>
      </div>
    </footer>
  );
}
