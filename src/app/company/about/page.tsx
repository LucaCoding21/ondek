import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import CompanyStory from "@/components/about/CompanyStory";
import AboutPrinciples from "@/components/about/AboutPrinciples";
import AboutKitCta from "@/components/about/AboutKitCta";

export const metadata: Metadata = {
  title: "About | OnDek Vinyl Decking",
  description:
    "OnDek Vinyl Worx manufactures waterproof vinyl deck membranes in Aldergrove, British Columbia, an extension of Innovative Aluminum Systems, supplying the construction trade since 2004.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <CompanyStory />
      <AboutPrinciples />
      <AboutKitCta />
    </>
  );
}
