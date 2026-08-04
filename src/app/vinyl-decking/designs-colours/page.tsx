import type { Metadata } from "next";
import DesignsHero from "@/components/designs-colours/DesignsHero";
import DesignsIntro from "@/components/designs-colours/DesignsIntro";
import PopularColours from "@/components/designs-colours/PopularColours";
import FreeKitCta from "@/components/designs-colours/FreeKitCta";

export const metadata: Metadata = {
  title: "Designs & Colours | OnDek Vinyl Decking",
  description:
    "Browse every OnDek vinyl decking design in greys, silvers, tans, and browns, and order free samples shipped to your door.",
};

export default function DesignsColoursPage() {
  return (
    <>
      <DesignsHero />
      <DesignsIntro />
      <PopularColours />
      <FreeKitCta />
    </>
  );
}
