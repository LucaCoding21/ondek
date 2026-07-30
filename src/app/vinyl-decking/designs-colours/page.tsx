import type { Metadata } from "next";
import DesignsHero from "@/components/designs-colours/DesignsHero";
import DesignsIntro from "@/components/designs-colours/DesignsIntro";
import ColourGallery from "@/components/designs-colours/ColourGallery";
import PopularColours from "@/components/designs-colours/PopularColours";
import FreeKitCta from "@/components/designs-colours/FreeKitCta";

export const metadata: Metadata = {
  title: "Designs & Colours | OnDek Vinyl Decking",
  description:
    "Browse every OnDek vinyl decking design and colour, from warm tans to cool greys, printed into the vinyl so it lasts. Filter by colour family and order free samples.",
};

export default function DesignsColoursPage() {
  return (
    <>
      <DesignsHero />
      <DesignsIntro />
      <ColourGallery />
      <PopularColours />
      <FreeKitCta />
    </>
  );
}
