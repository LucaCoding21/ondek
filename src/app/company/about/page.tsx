import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import CompanyStory from "@/components/about/CompanyStory";
import AboutPrinciples from "@/components/about/AboutPrinciples";
import AboutKitCta from "@/components/about/AboutKitCta";

export const metadata: Metadata = {
  title: "About | OnDek Vinyl Decking",
  description:
    "OnDek Vinyl Worx is a full service waterproof vinyl decking membrane company in Aldergrove, British Columbia, built on the success of Innovative Aluminum Systems, in business since 2004.",
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
