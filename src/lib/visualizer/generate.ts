/**
 * The ONE model-specific file in the visualizer.
 *
 * Everything else in the pipeline — the API route, the stock-combo script,
 * the prompt — talks to `generateDeckRender()` and knows nothing about
 * which provider renders the image. Swapping OpenAI for another model
 * means rewriting the private half of this file and nothing else.
 *
 * Server-side ONLY: this module reads OPENAI_API_KEY. It must never be
 * imported from a client component (the "server-only"-style guard below
 * throws in the browser instead of leaking the key).
 */

import { GENERATION_PROMPT } from "./prompt";

if (typeof window !== "undefined") {
  throw new Error("lib/visualizer/generate is server-only");
}

// ── The generic interface ───────────────────────────────────────────────

export type DeckRenderInput = {
  /** The visitor's deck photo — already validated, downscaled, EXIF-free */
  deckPhoto: Buffer;
  deckPhotoMime: string;
  /** The vinyl pattern swatch photo */
  vinylSwatch: Buffer;
  vinylSwatchMime: string;
  options?: {
    /** Override the tuned prompt (the stock script never does; a future
     *  provider experiment might) */
    prompt?: string;
    /**
     * Ask for intermediate frames and hand each one here as it lands.
     * Turns on provider streaming; costs a little more per render
     * (~13% more output tokens measured on gpt-image-2) and the frames
     * are full-detail guesses, not blurs — the caller decides how much
     * of them to show. Omit for a plain request/response render.
     */
    onPartial?: (image: Buffer, index: number) => void | Promise<void>;
    /** How many intermediate frames to ask for (1–3). Default 2. */
    partialImages?: number;
  };
};

export type DeckRenderResult = {
  image: Buffer;
  mime: string;
};

/** Thrown for provider failures the route may retry or surface */
export class GenerationError extends Error {
  constructor(
    message: string,
    /** true when a retry has a real chance (timeouts, 5xx, rate limits) */
    public retryable: boolean,
    /** "quota" when the provider account is out of credits — the whole
     *  feature is down, not just this render */
    public code?: "quota",
  ) {
    super(message);
    this.name = "GenerationError";
  }
}

export async function generateDeckRender(
  input: DeckRenderInput,
): Promise<DeckRenderResult> {
  return openAiRender(input);
}

// ── OpenAI implementation (nothing below leaves this file) ──────────────

const OPENAI_EDITS_URL = "https://api.openai.com/v1/images/edits";
// gpt-image-2 is the current flagship; gpt-image-1 retires Oct 23, 2026
const MODEL = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-2";
// Client's call: medium everywhere — roughly a quarter of the cost of
// high, and the input photos are read at high fidelity regardless
const QUALITY = process.env.OPENAI_IMAGE_QUALITY ?? "medium";
// Observed renders land in 30–45s; 90s is twice the slow end. The route's
// maxDuration has to cover this × its attempt count, so raise both together.
const TIMEOUT_MS = 90_000;

async function openAiRender(input: DeckRenderInput): Promise<DeckRenderResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new GenerationError("OPENAI_API_KEY is not configured", false);
  }

  // Order matters: the prompt says "Image 1 is a photo of a deck. Image 2
  // is a vinyl decking pattern swatch."
  const form = new FormData();
  form.append("model", MODEL);
  form.append("prompt", input.options?.prompt ?? GENERATION_PROMPT);
  form.append("quality", QUALITY);
  // High input fidelity keeps the untouched parts of the photo (railing,
  // house, furniture) close to pixel-identical — the whole point here.
  // gpt-image-2 always runs high-fidelity input and doesn't take the param.
  if (MODEL.startsWith("gpt-image-1")) {
    form.append("input_fidelity", "high");
  }
  form.append("size", "auto");
  const onPartial = input.options?.onPartial;
  if (onPartial) {
    form.append("stream", "true");
    form.append(
      "partial_images",
      String(Math.min(3, Math.max(1, input.options?.partialImages ?? 2))),
    );
  }
  form.append(
    "image[]",
    new Blob([new Uint8Array(input.deckPhoto)], { type: input.deckPhotoMime }),
    "deck" + extensionFor(input.deckPhotoMime),
  );
  form.append(
    "image[]",
    new Blob([new Uint8Array(input.vinylSwatch)], {
      type: input.vinylSwatchMime,
    }),
    "swatch" + extensionFor(input.vinylSwatchMime),
  );

  let response: Response;
  try {
    response = await fetch(OPENAI_EDITS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    // Network failure or timeout — both worth one retry
    throw new GenerationError(
      error instanceof Error ? error.message : "network failure",
      true,
    );
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    // An exhausted balance answers 429 too, but retrying it is pointless
    const outOfCredits =
      detail.includes("insufficient_quota") ||
      detail.includes("credit_balance_exhausted");
    // 429 and 5xx are transient; 4xx (bad key, moderation refusal) is not
    const retryable =
      !outOfCredits && (response.status === 429 || response.status >= 500);
    throw new GenerationError(
      `image API responded ${response.status}: ${detail.slice(0, 500)}`,
      retryable,
      outOfCredits ? "quota" : undefined,
    );
  }

  if (onPartial) {
    return readImageStream(response, onPartial);
  }

  const payload = (await response.json()) as {
    data?: { b64_json?: string }[];
  };
  const b64 = payload.data?.[0]?.b64_json;
  if (!b64) {
    throw new GenerationError("image API returned no image data", true);
  }

  // gpt-image returns PNG unless asked otherwise
  return { image: Buffer.from(b64, "base64"), mime: "image/png" };
}

/**
 * The streaming edits response is server-sent events:
 *   event: image_edit.partial_image   data: { b64_json, partial_image_index }
 *   event: image_edit.completed       data: { b64_json, usage }
 * Each partial is a full-size PNG (~3.7MB base64), so they're buffered
 * event-by-event, never all at once.
 */
async function readImageStream(
  response: Response,
  onPartial: (image: Buffer, index: number) => void | Promise<void>,
): Promise<DeckRenderResult> {
  if (!response.body) {
    throw new GenerationError("image API returned no stream body", true);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let final: Buffer | null = null;

  const handle = async (chunk: string) => {
    const dataLine = chunk.split("\n").find((line) => line.startsWith("data:"));
    if (!dataLine) return;
    const data = dataLine.slice(5).trim();
    if (!data || data === "[DONE]") return;
    let event: {
      type?: string;
      b64_json?: string;
      partial_image_index?: number;
      error?: { message?: string };
    };
    try {
      event = JSON.parse(data);
    } catch {
      return;
    }
    if (event.type === "error" || event.error) {
      throw new GenerationError(
        `image API stream error: ${event.error?.message ?? data.slice(0, 300)}`,
        true,
      );
    }
    if (!event.b64_json) return;
    const image = Buffer.from(event.b64_json, "base64");
    if (event.type === "image_edit.completed") {
      final = image;
    } else if (event.type === "image_edit.partial_image") {
      await onPartial(image, event.partial_image_index ?? 0);
    }
  };

  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let boundary: number;
      while ((boundary = buffer.indexOf("\n\n")) >= 0) {
        const chunk = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        await handle(chunk);
      }
    }
    if (buffer.trim()) await handle(buffer);
  } catch (error) {
    if (error instanceof GenerationError) throw error;
    // The socket dropped mid-stream — the same class of failure as a
    // network error on the plain path, and just as worth one retry
    throw new GenerationError(
      error instanceof Error ? error.message : "stream failure",
      true,
    );
  }

  if (!final) {
    throw new GenerationError("image API stream ended without an image", true);
  }
  return { image: final, mime: "image/png" };
}

function extensionFor(mime: string) {
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  return ".jpg";
}
