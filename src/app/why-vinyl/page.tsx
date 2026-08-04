import type { Metadata } from "next";
import WhyVinylHero from "@/components/why-vinyl/WhyVinylHero";
import MaterialComparison from "@/components/why-vinyl/MaterialComparison";
import ProjectShowcase from "@/components/why-vinyl/ProjectShowcase";
import SystemSection from "@/components/why-vinyl/SystemSection";
import UnderDeckLiving from "@/components/why-vinyl/UnderDeckLiving";
import VideoTestimonialReel from "@/components/VideoTestimonialReel";
import FreeKitCta from "@/components/designs-colours/FreeKitCta";

export const metadata: Metadata = {
  title: "Why Vinyl | OnDek Vinyl Decking",
  description:
    "What vinyl decking is, how it compares to wood and composite, how the welded membrane keeps a deck dry, and what a dry space under the deck is worth.",
};

export default function WhyVinylPage() {
  return (
    <>
      <WhyVinylHero />
      <MaterialComparison />
      <SystemSection />
      <UnderDeckLiving />
      <ProjectShowcase />
      <VideoTestimonialReel />
      <FreeKitCta />
    </>
  );
}
