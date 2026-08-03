import type { Metadata } from "next";
import DocsHero from "@/components/documents/DocsHero";
import DocsLibrary from "@/components/documents/DocsLibrary";
import DocsCta from "@/components/documents/DocsCta";

export const metadata: Metadata = {
  title: "Documents | OnDek Vinyl Decking",
  description:
    "Detail drawings, product and safety data sheets, approvals, the warranty, and the care routine for OnDek vinyl decking, searchable in one place.",
};

export default function DocumentsPage() {
  return (
    <>
      <DocsHero />
      <DocsLibrary />
      <DocsCta />
    </>
  );
}
