import type { SiteContentMap } from "@/lib/site-content";
import { Button } from "@/components/ui/Button";

type Props = {
  content: SiteContentMap;
};

export function Hero({ content }: Props) {
  const title = content["hero.title"] ?? "";
  const subtitle = content["hero.subtitle"] ?? "";
  const videoUrl = content["hero.video"]?.trim();
  const posterUrl = content["hero.poster"]?.trim();

  return (
    <section className="relative flex min-h-[90vh] w-full flex-col justify-end overflow-hidden bg-black pb-16 pt-28 sm:pb-24">
      <div className="absolute inset-0 z-0">
        {videoUrl ? (
          <video
            className="h-full w-full object-cover"
            src={videoUrl}
            poster={posterUrl || undefined}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#FFD1D1]/30 via-black to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6">
        <h1 className="font-[family-name:var(--font-anton)] text-5xl uppercase leading-[1.05] text-[#FFD1D1] sm:text-6xl md:text-7xl">
          {title}
        </h1>
        <p className="max-w-xl font-[family-name:var(--font-inter)] text-lg text-white sm:text-xl">
          {subtitle}
        </p>
        <div className="flex flex-wrap gap-4">
          <Button href="#booking">{content["booking.cta"] ?? "REQUEST A SPOT"}</Button>
        </div>
      </div>
    </section>
  );
}
