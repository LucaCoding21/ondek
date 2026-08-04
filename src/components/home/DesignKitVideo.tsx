import MutedLoopVideo from "@/components/MutedLoopVideo";

const VIMEO_ID = "521215844";

// The clip fades out to black before it actually ends, so loop=1 alone leaves
// a dead beat on screen every time round. Restarting this many seconds early
// cuts back to picture instead. Raise it if any black still shows through.
const BLACK_TAIL_SECONDS = 2;

/**
 * Fills whatever box the caller sizes — the section derives that from the
 * viewport height so the whole composition fits one screen. Overscanned
 * because the source is 1.775:1, just off 16:9.
 */
export default function DesignKitVideo() {
  return (
    <MutedLoopVideo
      videoId={VIMEO_ID}
      title="OnDek Design Kit"
      blackTailSeconds={BLACK_TAIL_SECONDS}
      overscan
    />
  );
}
