import type { Metadata } from "next";
import VideoLibrary from "@/components/videos/VideoLibrary";

export const metadata: Metadata = {
  title: "Videos | OnDek Vinyl Decking",
  description:
    "Watch and learn: the UltraFlash system, installation walkthroughs, and answers to the most-asked vinyl decking questions, from cleaning to seams to winter.",
};

export default function VideosPage() {
  return <VideoLibrary />;
}
