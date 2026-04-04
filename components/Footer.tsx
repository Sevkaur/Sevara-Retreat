import type { SiteContentMap } from "@/lib/site-content";

type Props = {
  content: SiteContentMap;
};

export function Footer({ content }: Props) {
  const tagline = content["footer.tagline"] ?? "";
  const email = content["footer.email"] ?? "";

  return (
    <footer className="w-full border-t border-black/10 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
    </footer>
  );
}
