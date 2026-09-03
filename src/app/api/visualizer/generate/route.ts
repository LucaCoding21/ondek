/**
 * POST /api/visualizer/generate — the only place the paid image API is
 * reachable from the outside, so every cost control lives on this path:
 * per-IP sliding window, per-session cookie counter, monthly hard cap,
 * server-side re-validation of the upload.
 *
 * Body: multipart form — `photo` (the deck photo file) + `sku`.
 *
 * Anything rejected before generation starts (limits, bad upload) is a
 * plain JSON failure with a real status code:
 *   { ok: false, error: <code>, message: <friendly text> }
 *
 * Once generation starts the response is a 200 NDJSON stream
 * (see lib/visualizer/stream.ts): zero or more `partial` messages carrying
 * a tiny preview frame, then exactly one `done` or `error`. Streaming is
 * what lets the stage show colour landing on the deck ~12s in instead of
 * nothing for ~33s. With PARTIAL_PREVIEWS.count = 0 the same stream just
 * carries the single `done`.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { LIMITS, PARTIAL_PREVIEWS } from "@/config/visualizer";
import {
  STREAM_CONTENT_TYPE,
  type GenerateStreamMessage,
} from "@/lib/visualizer/stream";
import { getVinyl } from "@/config/vinyls";
import {
  generateDeckRender,
  GenerationError,
} from "@/lib/visualizer/generate";
import {
  InvalidImageError,
  prepareDeckPhoto,
} from "@/lib/visualizer/serverImage";
import { allowRequest, hashIp } from "@/lib/visualizer/rateLimit";
import { logGeneration, monthlyCapReached } from "@/lib/visualizer/usage";

// Renders run 30–45s in practice (see .data/visualizer/usage.jsonl). The
// budget below must cover ATTEMPTS × the per-call timeout in generate.ts
// plus the sharp passes either side: 2 × 90s + a few seconds, well
// inside 300.
export const maxDuration = 300;
const ATTEMPTS = 2;

/** Renders come back as PNG (2–4MB at the working resolution, more once
 *  base64'd into JSON). Re-encoding to WebP cuts that by ~4× and keeps
 *  the response well under function body limits; it's also what the
 *  stock-combo script ships, so both modes store the same format. */
const RESPONSE_WEBP_QUALITY = 90;

const SESSION_COOKIE = "odk-viz-renders";

const UNAVAILABLE_MESSAGE =
  "Custom previews are temporarily unavailable. The stock gallery still works, or request a quote and we'll render your deck for you.";
const FAILED_MESSAGE =
  "The render didn't come together this time. Try again, your photo is still here.";

function failure(
  status: number,
  error: string,
  message: string,
): NextResponse {
  return NextResponse.json({ ok: false, error, message }, { status });
}

export async function POST(request: NextRequest) {
  const ip = hashIp(
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local",
  );

  if (!allowRequest(ip)) {
    return failure(
      429,
      "rate_limited",
      "Too many renders too quickly. Give it a minute and try again.",
    );
  }

  // The cookie is set httpOnly below; a tampered value is backstopped by
  // the IP window above and the monthly cap below.
  const used = Number(request.cookies.get(SESSION_COOKIE)?.value ?? 0) || 0;
  if (used >= LIMITS.sessionRenders) {
    return failure(
      429,
      "session_limit",
      "Looks like you've been designing up a storm today. Come back tomorrow for more renders, or email us to chat with an expert about your deck.",
    );
  }

  if (await monthlyCapReached()) {
    return failure(503, "monthly_cap", UNAVAILABLE_MESSAGE);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return failure(400, "bad_request", "That upload didn't come through.");
  }

  const sku = form.get("sku");
  const vinyl = typeof sku === "string" ? getVinyl(sku) : undefined;
  if (!vinyl) {
    return failure(400, "invalid_sku", "Pick a vinyl from the lineup first.");
  }

  const photo = form.get("photo");
  if (!(photo instanceof File)) {
    return failure(400, "bad_request", "No photo came through. Try again.");
  }

  let deck;
  try {
    deck = await prepareDeckPhoto(Buffer.from(await photo.arrayBuffer()));
  } catch (error) {
    if (error instanceof InvalidImageError) {
      return failure(415, "invalid_image", error.message);
    }
    throw error;
  }

  const swatch = await readFile(
    path.join(process.cwd(), "public", vinyl.swatchPath),
  );

  const started = Date.now();
  const log = (success: boolean, error?: string) =>
    logGeneration({
      at: new Date().toISOString(),
      ip,
      sku: vinyl.sku,
      source: "custom",
      success,
      latencyMs: Date.now() - started,
      error: error?.slice(0, 300),
    });

  // Runs the attempt loop and reports through `send`. Returns rather than
  // throws so the stream always ends with exactly one terminal message.
  const run = async (send: (message: GenerateStreamMessage) => void) => {
    let lastError = "";
    // One automatic retry on transient failures — a visitor deep in
    // designing is a lead, and a flaky upstream moment must not lose them
    for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
      try {
        const result = await generateDeckRender({
          deckPhoto: deck.data,
          deckPhotoMime: deck.mime,
          vinylSwatch: swatch,
          vinylSwatchMime: "image/jpeg",
          options:
            PARTIAL_PREVIEWS.count > 0
              ? {
                  partialImages: PARTIAL_PREVIEWS.count,
                  // Intermediate frames still show the old boards; only a
                  // thumbnail leaves the server (see PARTIAL_PREVIEWS)
                  onPartial: async (image, index) => {
                    const thumb = await sharp(image)
                      .resize(PARTIAL_PREVIEWS.edgePx, PARTIAL_PREVIEWS.edgePx, {
                        fit: "inside",
                      })
                      .webp({ quality: 70 })
                      .toBuffer();
                    send({
                      type: "partial",
                      image: `data:image/webp;base64,${thumb.toString("base64")}`,
                      index,
                    });
                  },
                }
              : undefined,
        });

        const webp = await sharp(result.image)
          .webp({ quality: RESPONSE_WEBP_QUALITY })
          .toBuffer();

        await log(true);
        send({
          type: "done",
          image: `data:image/webp;base64,${webp.toString("base64")}`,
          remaining: LIMITS.sessionRenders - used - 1,
        });
        return;
      } catch (error) {
        const retryable =
          error instanceof GenerationError ? error.retryable : false;
        lastError = error instanceof Error ? error.message : String(error);
        console.error(
          `[visualizer] generation attempt ${attempt + 1} failed:`,
          lastError,
        );

        // Provider account out of credits: the feature is down for
        // everyone, so show the same graceful state as the monthly cap
        if (error instanceof GenerationError && error.code === "quota") {
          await log(false, lastError);
          send({
            type: "error",
            error: "monthly_cap",
            message: UNAVAILABLE_MESSAGE,
          });
          return;
        }

        if (!retryable) break;
      }
    }

    await log(false, lastError);
    send({ type: "error", error: "generation_failed", message: FAILED_MESSAGE });
  };

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let open = true;
      const send = (message: GenerateStreamMessage) => {
        if (!open) return;
        try {
          controller.enqueue(encoder.encode(JSON.stringify(message) + "\n"));
        } catch {
          // The visitor navigated away mid-render; nothing left to tell
          open = false;
        }
      };
      try {
        await run(send);
      } catch (error) {
        // Anything the attempt loop didn't classify (e.g. sharp choking
        // on the model's output) still ends the stream cleanly
        console.error("[visualizer] generate route failed:", error);
        await log(false, error instanceof Error ? error.message : String(error));
        send({ type: "error", error: "generation_failed", message: FAILED_MESSAGE });
      } finally {
        open = false;
        try {
          controller.close();
        } catch {
          // already closed by the abort
        }
      }
    },
  });

  const response = new NextResponse(body, {
    headers: {
      "Content-Type": STREAM_CONTENT_TYPE,
      "Cache-Control": "no-store",
      // Keeps proxies from holding the stream back until it completes
      "X-Accel-Buffering": "no",
    },
  });
  // Headers go out before the render finishes, so the session counter
  // has to be committed up front: an attempt counts whether or not it
  // succeeds, the same way the IP window above already counts it.
  // A day, not a browser session: "come back tomorrow" should mean it.
  response.cookies.set(SESSION_COOKIE, String(used + 1), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}
