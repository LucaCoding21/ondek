import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import PopularDesigns from "@/components/home/PopularDesigns";
import DesignKit from "@/components/home/DesignKit";
import UltraSystem from "@/components/home/UltraSystem";
import UnderDeck from "@/components/home/UnderDeck";
import VideoTestimonialReel from "@/components/VideoTestimonialReel";
import QuoteSection from "@/components/home/QuoteSection";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <PopularDesigns />
      <DesignKit />
      <UltraSystem />
      <UnderDeck />
      <VideoTestimonialReel />
      <QuoteSection />
    </>
  );
}
