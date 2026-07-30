import type { Metadata } from "next";
import AdhesiveHero from "@/components/adhesive/AdhesiveHero";
import AdhesiveWhy from "@/components/adhesive/AdhesiveWhy";
import AdhesiveStats from "@/components/adhesive/AdhesiveStats";
import AdhesiveApplications from "@/components/adhesive/AdhesiveApplications";
import AdhesiveSpecs from "@/components/adhesive/AdhesiveSpecs";
import AdhesiveGuides from "@/components/adhesive/AdhesiveGuides";
import FreeKitCta from "@/components/designs-colours/FreeKitCta";

export const metadata: Metadata = {
  title: "Adhesive | OnDek Vinyl Decking",
  description:
    "OD 1010 All Season Adhesive is formulated for OnDek vinyl membranes, bonding plywood, treated lumber, concrete, and metal flashings into one warrantied waterproof system. Order through an OnDek dealer.",
};

export default function AdhesivePage() {
  return (
    <>
      <AdhesiveHero />
      <AdhesiveWhy />
      <AdhesiveStats />
      <AdhesiveApplications />
      <AdhesiveSpecs />
      <AdhesiveGuides />
      <FreeKitCta />
    </>
  );
}
