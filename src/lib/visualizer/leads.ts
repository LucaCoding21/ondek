/**
 * Delivery for visualizer quote requests.
 *
 * The site's other forms (contact, get-a-quote, dealer) are still
 * placeholder actions that deliver nowhere. This module is the first real
 * delivery path: with RESEND_API_KEY configured it emails the lead (with
 * the render attached) to LEAD_INBOX via Resend's REST API — no SDK, one
 * fetch. Without a key it appends the lead to .data/visualizer/leads.jsonl
 * so nothing is silently dropped in development.
 *
 * The older forms can be pointed at deliverLead() when they get wired up.
 */

import { appendFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { LEAD_INBOX } from "@/config/visualizer";

if (typeof window !== "undefined") {
  throw new Error("lib/visualizer/leads is server-only");
}

export type Lead = {
  subject: string;
  replyTo: string;
  /** Rendered as "Label: value" lines in the notification body */
  fields: Record<string, string>;
  attachment?: {
    filename: string;
    /** base64, no data: prefix */
    content: string;
  };
};

export type DeliveryResult = {
  ok: boolean;
  /** "email" when it went to the inbox, "log" when it fell back to disk */
  via: "email" | "log";
};

const LOG_DIR = path.join(process.cwd(), ".data", "visualizer");

export async function deliverLead(lead: Lead): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return logLead(lead);

  const text = Object.entries(lead.fields)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:
        process.env.VISUALIZER_LEAD_FROM ??
        "OnDek Visualizer <onboarding@resend.dev>",
      to: [LEAD_INBOX],
      reply_to: lead.replyTo,
      subject: lead.subject,
      text,
      attachments: lead.attachment
        ? [
            {
              filename: lead.attachment.filename,
              content: lead.attachment.content,
            },
          ]
        : undefined,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    console.error(
      "[visualizer] lead email failed:",
      response.status,
      await response.text().catch(() => ""),
    );
    // The visitor's details still land somewhere a human can find them
    await logLead(lead);
    return { ok: false, via: "email" };
  }

  return { ok: true, via: "email" };
}

async function logLead(lead: Lead): Promise<DeliveryResult> {
  try {
    await mkdir(LOG_DIR, { recursive: true });
    let attachmentFile: string | undefined;
    if (lead.attachment) {
      attachmentFile = path.join(
        LOG_DIR,
        `lead-${Date.now()}-${lead.attachment.filename}`,
      );
      await writeFile(
        attachmentFile,
        Buffer.from(lead.attachment.content, "base64"),
      );
    }
    await appendFile(
      path.join(LOG_DIR, "leads.jsonl"),
      JSON.stringify({
        at: new Date().toISOString(),
        subject: lead.subject,
        replyTo: lead.replyTo,
        fields: lead.fields,
        attachmentFile,
      }) + "\n",
    );
    console.warn(
      "[visualizer] RESEND_API_KEY not set — lead written to .data/visualizer/leads.jsonl instead of emailed",
    );
    return { ok: true, via: "log" };
  } catch (error) {
    console.error("[visualizer] lead fallback log failed:", error);
    return { ok: false, via: "log" };
  }
}
