import type { Metadata } from "next";
import AdhesiveHero from "@/components/adhesive/AdhesiveHero";
import AdhesiveOverview from "@/components/adhesive/AdhesiveOverview";
import AdhesiveFeatures from "@/components/adhesive/AdhesiveFeatures";
import AdhesiveGuides from "@/components/adhesive/AdhesiveGuides";

export const metadata: Metadata = {
  title: "Adhesive | OnDek Vinyl Decking",
  description:
    "OD 1010 All Season Adhesive is an aggressive, solvent-based contact adhesive formulated for fleece and fabric-back vinyl decking membranes, for horizontal and vertical surfaces. Order through an OnDek dealer.",
};

export default function AdhesivePage() {
  return (
    <>
      <AdhesiveHero />
      <AdhesiveOverview />
      <AdhesiveFeatures />
      <AdhesiveGuides />
    </>
  );
}
