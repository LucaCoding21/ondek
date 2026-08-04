import type { Metadata } from "next";
import FaqBrowser from "@/components/faqs/FaqBrowser";
import FaqContact from "@/components/faqs/FaqContact";
import { FAQ_CATEGORIES } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "FAQs | OnDek Vinyl Decking",
  description:
    "Answers on OnDek vinyl decking: what the PVC membrane is, how it is installed, what it has been tested against, how to clean it, and what the 15 year waterproofing warranty covers.",
};

/** FAQPage structured data, built from the same src/lib/faqs.ts the page
 *  renders — the markup and the schema can never say different things. */
function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_CATEGORIES.flatMap((category) =>
      category.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    ),
  };
}

export default function FaqsPage() {
  const jsonLd = buildFaqJsonLd();

  return (
    <>
      {/* The < escape stops a "<" inside any answer from closing this script
          tag early — the same sanitisation step the contact page uses. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <FaqBrowser />
      <FaqContact />
    </>
  );
}
