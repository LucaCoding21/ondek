import type { Metadata } from "next";
import KitExperience from "@/components/free-design-kit/KitExperience";

export const metadata: Metadata = {
  title: "Free Design Kit | OnDek Vinyl Decking",
  description:
    "Request your free OnDek design kit: real samples of every vinyl decking style and colour, UltraFlash and UltraClip samples, and warranty information, shipped free.",
};

export default function FreeDesignKitPage() {
  return <KitExperience />;
}
