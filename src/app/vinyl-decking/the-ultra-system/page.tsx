import type { Metadata } from "next";
import UltraHero from "@/components/ultra-system/UltraHero";
import UltraIntro from "@/components/ultra-system/UltraIntro";
import UltraPinned from "@/components/ultra-system/UltraPinned";
import ProjectGallery from "@/components/ultra-system/ProjectGallery";
import UltraBenefits from "@/components/ultra-system/UltraBenefits";
import UltraWarranty from "@/components/ultra-system/UltraWarranty";
import FreeKitCta from "@/components/designs-colours/FreeKitCta";

export const metadata: Metadata = {
  title: "The Ultra System | OnDek Vinyl Decking",
  description:
    "The Ultra system is OnDek's complete waterproofing system: multi-layer vinyl membrane, heat-welded seams, and system-matched adhesive, engineered and warrantied as one.",
};

export default function UltraSystemPage() {
  return (
    <>
      <UltraHero />
      <UltraIntro />
      <UltraPinned />
      <ProjectGallery />
      <UltraBenefits />
      <UltraWarranty />
      <FreeKitCta />
    </>
  );
}
