/**
 * Browser-side image plumbing for the visualizer: pre-shrinking uploads,
 * turning the visible design into a downloadable/attachable JPEG, and
 * compositing the compare view onto a canvas for download.
 */

const UPLOAD_EDGE = 1600;
const JPEG_QUALITY = 0.87;

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
  );
}

async function decode(source: Blob): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(source);
  } catch {
    // Some formats decode via <img> where createImageBitmap refuses
    const url = URL.createObjectURL(source);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return img;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

function drawScaled(
  source: ImageBitmap | HTMLImageElement,
  maxEdge: number,
): HTMLCanvasElement {
  const w = "naturalWidth" in source ? source.naturalWidth : source.width;
  const h = "naturalHeight" in source ? source.naturalHeight : source.height;
  const scale = Math.min(1, maxEdge / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w * scale));
  canvas.height = Math.max(1, Math.round(h * scale));
  canvas.getContext("2d")!.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * Downscale an upload before it crosses the wire. Returns null when the
 * browser can't decode the file (HEIC outside Safari, typically) — the
 * caller then sends the original bytes and lets the server try.
 * Re-encoding through canvas also drops EXIF on the client side.
 */
export async function shrinkUpload(file: File): Promise<Blob | null> {
  try {
    const source = await decode(file);
    const blob = await canvasToBlob(drawScaled(source, UPLOAD_EDGE));
    if ("close" in source) source.close();
    return blob;
  } catch {
    return null;
  }
}

/** The currently visible design as a JPEG blob (download + email attachment) */
export async function imageToJpeg(
  src: string,
  maxEdge = 2048,
): Promise<Blob | null> {
  try {
    const response = await fetch(src);
    const source = await decode(await response.blob());
    const blob = await canvasToBlob(drawScaled(source, maxEdge));
    if ("close" in source) source.close();
    return blob;
  } catch {
    return null;
  }
}

/**
 * The compare view as shown: design A left of the divider, design B right,
 * with the two vinyl names lettered into the corners.
 */
export async function compositeCompare(
  srcA: string,
  srcB: string,
  labelA: string,
  labelB: string,
  split: number,
): Promise<Blob | null> {
  try {
    const [a, b] = await Promise.all([
      fetch(srcA).then((r) => r.blob()).then(decode),
      fetch(srcB).then((r) => r.blob()).then(decode),
    ]);

    const base = drawScaled(a, 2048);
    const { width, height } = base;
    const ctx = base.getContext("2d")!;
    const divider = Math.round(width * Math.min(0.99, Math.max(0.01, split)));

    // Right side: design B, clipped to the right of the divider
    ctx.save();
    ctx.beginPath();
    ctx.rect(divider, 0, width - divider, height);
    ctx.clip();
    ctx.drawImage(b, 0, 0, width, height);
    ctx.restore();

    // Divider line
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(divider - 1, 0, 3, height);

    // Labels
    const pad = Math.round(width * 0.015);
    const fontSize = Math.max(16, Math.round(width * 0.018));
    ctx.font = `700 ${fontSize}px sans-serif`;
    ctx.textBaseline = "top";
    const drawLabel = (text: string, alignRight: boolean) => {
      const metrics = ctx.measureText(text);
      const boxW = metrics.width + pad * 2;
      const boxH = fontSize + pad * 1.4;
      const x = alignRight ? width - boxW - pad : pad;
      ctx.fillStyle = "rgba(20,20,20,0.72)";
      ctx.fillRect(x, pad, boxW, boxH);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(text, x + pad, pad + boxH / 2 - fontSize / 2);
    };
    drawLabel(labelA, false);
    drawLabel(labelB, true);

    if ("close" in a) a.close();
    if ("close" in b) b.close();
    return canvasToBlob(base);
  } catch {
    return null;
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the click a beat before the URL disappears
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** ondek-{vinylName}.jpg, with the name made filesystem-friendly */
export function designFilename(vinylName: string) {
  return `ondek-${vinylName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.jpg`;
}

/** True when the image at `url` is taller than it is wide — the stage
 *  swaps to a portrait frame so phone photos don't render tiny */
export function isPortraitUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalHeight > img.naturalWidth);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}
