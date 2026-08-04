import Image, { type ImageProps } from "next/image";
import { BLUR_MAP } from "@/lib/blur-map";

/**
 * next/image with an automatic blur placeholder. Local photos referenced by
 * string path get their tiny preview from BLUR_MAP, so nothing flashes white
 * while the full image loads. Anything not in the map — or with its own
 * placeholder already set — falls straight through to next/image.
 */
export default function SiteImage(props: ImageProps) {
  const blur =
    typeof props.src === "string" && !props.placeholder && !props.blurDataURL
      ? BLUR_MAP[props.src]
      : undefined;

  if (!blur) return <Image {...props} />;
  return <Image {...props} placeholder="blur" blurDataURL={blur} />;
}
