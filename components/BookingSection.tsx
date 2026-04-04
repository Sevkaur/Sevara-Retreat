import type { SiteContentMap } from "@/lib/site-content";
import { Button } from "@/components/ui/Button";

type Props = {
  id: string;
  content: SiteContentMap;
};

export function BookingSection({ id, content }: Props) {
  const title = content["booking.title"] ?? "";
  const body = content["booking.body"] ?? "";
  const cta = content["booking.cta"] ?? "";

  return (
    <section id={id} className="w-full scroll-mt-24 bg-[#FFD1D1] py-20 sm:py-28">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-4 sm:px-6">
        <h2 className="font-[family-name:var(--font-anton)] text-4xl uppercase leading-tight text-white sm:text-5xl">
          {title}
        </h2>
        <p className="font-[family-name:var(--font-inter)] text-lg leading-relaxed text-white sm:text-xl">
          {body}
        </p>
        <Button href={`mailto:${content["footer.email"] ?? "hello@sevara-retreat.com"}`}>
          {cta}
        </Button>
      </div>
    </section>
  );
}
