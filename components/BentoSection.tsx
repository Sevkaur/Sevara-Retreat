import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { SiteContentMap } from "@/lib/site-content";

type Props = {
  id: string;
  titleKey: string;
  bodyKey: string;
  imageKeys: string[];
  content: SiteContentMap;
  variant: "light" | "pink";
};

function BentoCell({
  url,
  sizes,
  minClass,
}: {
  url: string | undefined;
  sizes: string;
  minClass: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-neutral-200 ${minClass}`}>
      {url ? (
        <Image src={url} alt="" fill className="object-cover" sizes={sizes} />
      ) : (
        <div className="flex h-full min-h-[inherit] w-full items-center justify-center text-xs uppercase tracking-wide text-neutral-500">
          Photo
        </div>
      )}
    </div>
  );
}

export function BentoSection({ id, titleKey, bodyKey, imageKeys, content, variant }: Props) {
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

  return (
    <section id={id} className={`w-full scroll-mt-24 ${bg} py-16 sm:py-24`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
