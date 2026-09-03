"use server";

/**
 * Quote request from the visualizer. Follows the house form conventions
 * (hand-rolled validation, honeypot, friendly errors — zod is not a
 * dependency here), and delivers through lib/visualizer/leads.ts, which
 * emails the inbox when RESEND_API_KEY is configured and logs to disk
 * when it isn't.
 *
 * Arrives as FormData because the current design image rides along as a
 * client-rendered JPEG. next.config.ts raises the server action body
 * limit to make room for it.
 */

import { getVinyl } from "@/config/vinyls";
import { getStockLayout, LEAD_INBOX } from "@/config/visualizer";
import { deliverLead } from "@/lib/visualizer/leads";
import { GENERAL_EMAIL } from "@/lib/contact";

export type VisualizerQuoteResult = { ok: boolean; error?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Attachment ceiling — the client downscales before sending, this is the
 *  server's backstop (and it must stay under the action body limit) */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function clean(value: FormDataEntryValue | null, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > max ? null : trimmed;
}

export async function submitVisualizerQuote(
  formData: FormData,
): Promise<VisualizerQuoteResult> {
  const invalid: VisualizerQuoteResult = {
    ok: false,
    error: `Some details did not come through right. Give it another try, or email us at ${GENERAL_EMAIL}.`,
  };

  // Honeypot: a filled "website" field means a bot. Report success, send
  // nothing, let it think it got through.
  const honeypot = formData.get("website");
  if (typeof honeypot !== "string" || honeypot.trim() !== "") {
    return { ok: true };
  }

  const name = clean(formData.get("name"), 120);
  if (!name) return invalid;

  const email = clean(formData.get("email"), 200);
  if (!email || !EMAIL.test(email)) return invalid;

  const location = clean(formData.get("location"), 160);
  if (!location) return invalid;

  const note = clean(formData.get("note"), 2000);
  if (note === null) return invalid;

  // Selection context. The vinyl must be real; the rest is best-effort.
  const sku = clean(formData.get("vinylSku"), 60);
  const vinyl = sku ? getVinyl(sku) : undefined;
  if (!vinyl) return invalid;

  const mode = clean(formData.get("mode"), 20);
  if (mode !== "stock" && mode !== "custom") return invalid;

  const layoutId = clean(formData.get("layoutId"), 60) ?? "";
  const layout = layoutId ? getStockLayout(layoutId) : undefined;
  const modeLabel =
    mode === "stock"
      ? `Stock layout: ${layout?.name ?? layoutId}`
      : "Their own deck photo";

  // The current design, rendered client-side and shipped as a JPEG blob.
  // Optional: a lead without the picture still beats no lead.
  let attachment: { filename: string; content: string } | undefined;
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    if (image.size > MAX_IMAGE_BYTES) return invalid;
    attachment = {
      filename: `ondek-${vinyl.sku}.jpg`,
      content: Buffer.from(await image.arrayBuffer()).toString("base64"),
    };
  }

  const result = await deliverLead({
    subject: `[Visualizer quote] ${vinyl.name} · ${name}`,
    replyTo: email,
    fields: {
      Name: name,
      Email: email,
      Location: location,
      Vinyl: `${vinyl.name} (${vinyl.sku})`,
      Mode: modeLabel,
      Region: "All regions (geogating not live)",
      Note: note || "Not provided",
      "Design image": attachment ? "attached" : "not attached",
      "Delivery inbox": LEAD_INBOX,
    },
    attachment,
  });

  if (!result.ok) {
    return {
      ok: false,
      error: `Something went wrong sending your request. Try again, or email us at ${GENERAL_EMAIL}.`,
    };
  }

  return { ok: true };
}
