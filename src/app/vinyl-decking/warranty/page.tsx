import type { Metadata } from "next";
import WarrantyHero from "@/components/warranty/WarrantyHero";
import WarrantyCoverage from "@/components/warranty/WarrantyCoverage";
import WarrantyClaim from "@/components/warranty/WarrantyClaim";
import WarrantyFaq from "@/components/warranty/WarrantyFaq";
import WarrantyCta from "@/components/warranty/WarrantyCta";

export const metadata: Metadata = {
  title: "Warranty & Care | OnDek Vinyl Decking",
  description:
    "OnDek vinyl decking is covered by a 15 Year Waterproofing / 5 Year Appearance warranty. What the coverage includes, how to register a claim, and answers on caring for the deck.",
};

export default function WarrantyPage() {
  return (
    <>
      <WarrantyHero />
      <WarrantyCoverage />
      <WarrantyClaim />
      <WarrantyFaq />
      <WarrantyCta />
    </>
  );
}
