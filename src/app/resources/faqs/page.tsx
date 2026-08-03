import type { Metadata } from "next";
import FaqBrowser from "@/components/faqs/FaqBrowser";
import FaqContact from "@/components/faqs/FaqContact";

export const metadata: Metadata = {
  title: "FAQs | OnDek Vinyl Decking",
  description:
    "Answers on OnDek vinyl decking: what the PVC membrane is, how it is installed, what it has been tested against, how to clean it, and what the 15 year waterproofing warranty covers.",
};

export default function FaqsPage() {
  return (
    <>
      <FaqBrowser />
      <FaqContact />
    </>
  );
}
