import type { Metadata } from "next";
import DealerHero from "@/components/become-a-dealer/DealerHero";
import DealerWhy from "@/components/become-a-dealer/DealerWhy";
import DealerSupport from "@/components/become-a-dealer/DealerSupport";
import VideoTestimonialReel from "@/components/VideoTestimonialReel";
import DealerApplication from "@/components/become-a-dealer/DealerApplication";

export const metadata: Metadata = {
  title: "Become a Dealer | OnDek Vinyl Decking",
  description:
    "Install and sell OnDek waterproof vinyl decking. Why contractors partner with us, the training and support behind the Ultra system, and the dealer application form.",
};

export default function BecomeADealerPage() {
  return (
    <>
      <DealerHero />
      <DealerWhy />
      <DealerSupport />
      <VideoTestimonialReel />
      <DealerApplication />
    </>
  );
}
