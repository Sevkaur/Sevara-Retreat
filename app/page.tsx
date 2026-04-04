import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeatureSection } from "@/components/FeatureSection";
import { BentoSection } from "@/components/BentoSection";
import { BookingSection } from "@/components/BookingSection";
import { Footer } from "@/components/Footer";
import { getSiteContent } from "@/lib/site-content";

export const revalidate = 60;

export default async function Home() {
  const content = await getSiteContent();

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero content={content} />
        <FeatureSection
          id="retreat"
          titleKey="retreat.title"
          bodyKey="retreat.body"
          imageKey="retreat.image"
          content={content}
          variant="light"
          imagePosition="right"
        />
        <BentoSection
          id="accommodation"
          titleKey="accommodation.title"
          bodyKey="accommodation.body"
          imageKeys={[
            "accommodation.bento_1",
            "accommodation.bento_2",
            "accommodation.bento_3",
          ]}
          content={content}
          variant="pink"
        />
        <BentoSection
          id="extras"
          titleKey="extras.title"
          bodyKey="extras.body"
          imageKeys={[
            "extras.bento_1",
            "extras.bento_2",
            "extras.bento_3",
            "extras.bento_4",
          ]}
          content={content}
          variant="light"
        />
        <BookingSection id="booking" content={content} />
      </main>
      <Footer content={content} />
    </div>
  );
}
