import type { Metadata } from "next";
import QuoteWizard from "@/components/get-a-quote/QuoteWizard";

export const metadata: Metadata = {
  title: "Get a Quote | OnDek Vinyl Decking",
  description:
    "Tell us about your deck in three quick steps and get a vinyl decking quote, for homeowners, contractors, property managers, and designers.",
};

export default function GetAQuotePage() {
  return <QuoteWizard />;
}
