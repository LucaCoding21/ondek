import type { Metadata } from "next";
import WhyVinylHero from "@/components/why-vinyl/WhyVinylHero";
import MaterialComparison from "@/components/why-vinyl/MaterialComparison";
import ProjectShowcase from "@/components/why-vinyl/ProjectShowcase";
import SystemSection from "@/components/why-vinyl/SystemSection";
import UnderDeckLiving from "@/components/why-vinyl/UnderDeckLiving";
import Testimonials from "@/components/home/Testimonials";
import FreeKitCta from "@/components/designs-colours/FreeKitCta";

export const metadata: Metadata = {
  title: "Why Vinyl | OnDek Vinyl Decking",
  description:
    "Vinyl, wood, or composite: how each one handles water, why a fusion-welded OnDek membrane is the last deck surface you'll install, and what a dry space under the deck is worth.",
};

export default function WhyVinylPage() {
  return (
    <>
      <WhyVinylHero />
      <MaterialComparison />
      <SystemSection />
      <UnderDeckLiving />
      <ProjectShowcase />
      <Testimonials />
      <FreeKitCta />
    </>
  );
}
