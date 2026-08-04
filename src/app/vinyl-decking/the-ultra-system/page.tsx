import type { Metadata } from "next";
import UltraHero from "@/components/ultra-system/UltraHero";
import UltraIntro from "@/components/ultra-system/UltraIntro";
import UltraPinned from "@/components/ultra-system/UltraPinned";
import UltraFeatures from "@/components/ultra-system/UltraFeatures";
import ProjectGallery from "@/components/ultra-system/ProjectGallery";
import UltraBenefits from "@/components/ultra-system/UltraBenefits";
import FreeKitCta from "@/components/designs-colours/FreeKitCta";

export const metadata: Metadata = {
  title: "The Ultra System | OnDek Vinyl Decking",
  description:
    "Ultra Seam and Ultra Edge: PVC-to-PVC welded seams that tested stronger than the membrane itself, and a screw-free snap-fit edge built for seasonal movement.",
};

export default function UltraSystemPage() {
  return (
    <>
      <UltraHero />
      <UltraIntro />
      <UltraPinned />
      <UltraFeatures />
      <ProjectGallery />
      <UltraBenefits />
      <FreeKitCta />
    </>
  );
}
