/**
 * Server-side preparation of an uploaded deck photo before it goes to the
 * image API: prove it really is an image, downscale to the working
 * resolution, and re-encode — which drops EXIF (GPS position included)
 * on the floor, since sharp only carries metadata over when asked to.
 */

import sharp, { type Metadata } from "sharp";
import { LIMITS } from "@/config/visualizer";

export class InvalidImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidImageError";
  }
}

export type PreparedImage = {
  data: Buffer;
  mime: "image/webp";
  width: number;
  height: number;
};

/**
 * Throws InvalidImageError for anything that isn't a decodable image of a
 * supported format — the server never trusts the client's MIME claim or
 * extension, it decodes the actual bytes.
 */
export async function prepareDeckPhoto(bytes: Buffer): Promise<PreparedImage> {
  if (bytes.byteLength > LIMITS.uploadMaxBytes) {
    throw new InvalidImageError("That photo is over the 10MB limit.");
  }

  const pipeline = sharp(bytes, { failOn: "error" });
  let meta: Metadata;
  try {
    meta = await pipeline.metadata();
  } catch {
    throw new InvalidImageError(
      "That file doesn't look like a photo we can read. JPEG, PNG, or WebP work best.",
    );
  }

  const format = meta.format ?? "";
  // sharp reports HEIC as "heif", but the prebuilt binary only decodes the
  // AVIF flavour (sharp.format.heif.input.fileSuffix is [".avif"]), so a
  // real iPhone HEIC would fail in .toBuffer() below. Name the problem
  // instead of letting it fall through to the generic message.
  if (format === "heif") {
    throw new InvalidImageError(
      "HEIC photos need converting first. Export it as JPEG and try again.",
    );
  }
  const supported = ["jpeg", "png", "webp", "avif"];
  if (!supported.includes(format)) {
    throw new InvalidImageError(
      "That format isn't supported. JPEG, PNG, or WebP work best.",
    );
  }

  try {
    // .rotate() applies the EXIF orientation before the metadata is
    // dropped, so phone photos don't arrive sideways at the API.
    const { data, info } = await pipeline
      .rotate()
      .resize(LIMITS.workingEdgePx, LIMITS.workingEdgePx, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 88 })
      .toBuffer({ resolveWithObject: true });

    return {
      data,
      mime: "image/webp",
      width: info.width,
      height: info.height,
    };
  } catch {
    throw new InvalidImageError(
      "We couldn't process that photo. Try exporting it as JPEG and uploading again.",
    );
  }
}
