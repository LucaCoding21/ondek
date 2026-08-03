import type { Metadata } from "next";
import BlogHero from "@/components/blog/BlogHero";
import BlogIndex from "@/components/blog/BlogIndex";
import FreeKitCta from "@/components/designs-colours/FreeKitCta";

export const metadata: Metadata = {
  title: "Blog | OnDek Vinyl Decking",
  description:
    "How the OnDek system goes together, what a vinyl deck asks of you once it's down, and the questions installers and homeowners keep bringing us.",
};

export default function BlogPage() {
  return (
    <>
      <BlogHero />
      <BlogIndex />
      <FreeKitCta />
    </>
  );
}
