import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import {
  LeadSection,
  EmphasisBand,
  IncludedGrid,
  EditorialSplit,
  BridgeSection,
  OutcomesGrid,
  ClosingStrip,
} from "@/components/retreat/RetreatBlocks";
import { BentoSection } from "@/components/BentoSection";
import { BookingSection } from "@/components/BookingSection";
import { Footer } from "@/components/Footer";
import { EXTRAS_ROOM_IMAGE_KEYS } from "@/lib/content-registry";
import { getSiteContent } from "@/lib/site-content";

export const revalidate = 60;

export default async function Home() {
  const content = await getSiteContent();

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero content={content} />
        <LeadSection content={content} />
        <EmphasisBand content={content} />
        <IncludedGrid content={content} />
        <EditorialSplit content={content} />
        <BridgeSection content={content} />
        <BentoSection
          id="accommodation"
          titleKey="accommodation.title"
          bodyKey="accommodation.body"
          imageKeys={[
            "accommodation.bento_1",
            "accommodation.bento_2",
            "accommodation.bento_3",
          ]}
          cellMobileAspects={["aspect-video", "aspect-[4/5]", "aspect-[4/5]"]}
          content={content}
          variant="pink"
        />
        <BentoSection
          id="extras"
          titleKey="extras.title"
          bodyKey="extras.body"
          imageKeys={[...EXTRAS_ROOM_IMAGE_KEYS]}
          content={content}
          variant="light"
          swipeLayout
          largeHeading
        />
        <OutcomesGrid content={content} />
        <ClosingStrip content={content} />
        <BookingSection id="booking" content={content} />
      </main>
      <Footer content={content} />
    </div>
  );
}
