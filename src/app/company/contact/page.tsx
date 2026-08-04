import type { Metadata } from "next";
import ContactScreen from "@/components/contact/ContactScreen";
import ContactDirectory from "@/components/contact/ContactDirectory";
import { buildContactJsonLd } from "@/lib/contactJsonLd";

export const metadata: Metadata = {
  title: "Contact | OnDek Vinyl Decking",
  description:
    "Reach OnDek Vinyl Worx: offices in Aldergrove, British Columbia and Wellsville, Ohio, direct lines for sales and customer service, and a message form for everything else.",
};

/** The screen carries the action; the directory below it collapses the
 *  reference detail so it is there without being in the way. */
export default function ContactPage() {
  const jsonLd = buildContactJsonLd();

  return (
    <>
      {/* Structured data, built from src/lib/contact.ts. The < escape is
          what stops a "<" inside any of that copy from closing this script tag
          early — it is the sanitisation step Next's JSON-LD guide calls for. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <ContactScreen />
      <ContactDirectory />
    </>
  );
}
