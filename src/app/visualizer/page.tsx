import type { Metadata } from "next";
import VisualizerExperience from "@/components/visualizer/VisualizerExperience";

export const metadata: Metadata = {
  title: "Deck Visualizer | OnDek Vinyl Decking",
  description:
    "See OnDek vinyl on a real deck. Try the lineup on our decks or upload a photo of yours, compare designs side by side, download the look, and request a quote.",
};

export default async function VisualizerPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Deep links: /visualizer?vinyl={sku}&layout={id} — validated inside the
  // experience against the config, so a stale link degrades to defaults
  const params = await searchParams;
  const vinyl = typeof params.vinyl === "string" ? params.vinyl : undefined;
  const layout = typeof params.layout === "string" ? params.layout : undefined;

  return (
    <div className="bg-background">
      <VisualizerExperience initialVinylSku={vinyl} initialLayoutId={layout} />
    </div>
  );
}
