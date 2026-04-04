import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { SiteContentMap } from "@/lib/site-content";

type Variant = "light" | "pink";

type Props = {
  id: string;
  titleKey: string;
  bodyKey: string;
  imageKey?: string;
  content: SiteContentMap;
  variant: Variant;
  imagePosition?: "left" | "right";
};

export function FeatureSection({
  id,
  titleKey,
  bodyKey,
  imageKey,
  content,
  variant,
  imagePosition = "right",
}: Props) {
  const title = content[titleKey] ?? "";
  const body = content[bodyKey] ?? "";
  const imageUrl = imageKey ? content[imageKey]?.trim() : "";

  const isPink = variant === "pink";
  const bg = isPink ? "bg-[#FFD1D1]" : "bg-white";
  const text = isPink ? "text-white" : "text-black";
  const headingColor = isPink ? "text-white" : "text-[#FFD1D1]";

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
      </div>
    ) : imageKey ? (
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200 sm:aspect-[16/10]" />
    ) : null;

  return (
    <section id={id} className={`w-full scroll-mt-24 ${bg} py-16 sm:py-24`}>
      <div
        className={`mx-auto grid max-w-6xl gap-10 px-4 sm:items-center sm:gap-14 sm:px-6 ${
          imageBlock ? "sm:grid-cols-2" : "max-w-3xl"
        }`}
      >
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
        {imageBlock ? (
          <div className={imagePosition === "left" ? "sm:order-1" : ""}>
            <ScrollReveal className="h-full w-full">{imageBlock}</ScrollReveal>
          </div>
        ) : null}
      </div>
    </section>
  );
}
