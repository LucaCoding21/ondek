"use server";

/**
 * PLACEHOLDER DESTINATION — wire this up before the page goes live.
 *
 * Same situation as the dealer application: this action validates the quote
 * request and reports success, but it DELIVERS NOWHERE — there is no mail
 * service or CRM in this project yet. Before launch, send `request` to
 * whatever OnDek actually reads, with `email` as the reply-to and `subject`
 * as the subject line, and return `ok: false` when that call fails.
 *
 * Validation is hand-rolled on purpose: zod is not a dependency here.
 */

import {
  DECK_SIZES,
  PERSONAS,
  PROJECT_TYPES,
  TIMELINES,
  type Option,
  type Persona,
} from "./options";
import { GENERAL_EMAIL } from "@/lib/contact";

export type QuotePayload = {
  persona: string;
  projectType: string;
  deckSize: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  notes: string;
  /** Honeypot — humans never see this field, so it must come back empty */
  website: string;
};

export type QuoteResult = { ok: boolean; error?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Trimmed string within bounds, or null when the value is not usable */
function clean(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > max ? null : trimmed;
}

function labelFor(options: readonly Option[], value: string) {
  return options.find((option) => option.value === value)?.label ?? "";
}

export async function submitQuoteRequest(
  payload: QuotePayload,
): Promise<QuoteResult> {
  const invalid: QuoteResult = {
    ok: false,
    error: `Some details did not come through right. Give it another try, or email us at ${GENERAL_EMAIL}.`,
  };

  // Honeypot: a filled "website" field means a bot filled the form. Report
  // success and send nothing, so it thinks it got through.
  if (typeof payload?.website !== "string" || payload.website.trim() !== "") {
    return { ok: true };
  }

  const persona = clean(payload.persona, 40);
  if (!persona || !PERSONAS.some((p) => p.value === persona)) return invalid;

  // Step-2 options depend on the persona, so the project type is checked
  // against that persona's list rather than every list
  const projectOptions = PROJECT_TYPES[persona as Persona];
  const projectType = clean(payload.projectType, 40);
  if (!projectType || !projectOptions.some((o) => o.value === projectType)) {
    return invalid;
  }

  const timeline = clean(payload.timeline, 40);
  if (!timeline || !TIMELINES.some((o) => o.value === timeline)) return invalid;

  const deckSize = clean(payload.deckSize, 40);
  if (deckSize === null) return invalid;
  if (deckSize && !DECK_SIZES.some((o) => o.value === deckSize)) return invalid;

  const name = clean(payload.name, 120);
  if (!name) return invalid;

  const email = clean(payload.email, 200);
  if (!email || !EMAIL.test(email)) return invalid;

  // Ten digits is a North American number with or without the country code
  const phone = clean(payload.phone, 40);
  if (!phone || phone.replace(/\D/g, "").length < 10) return invalid;

  const city = clean(payload.city, 120);
  if (!city) return invalid;

  const province = clean(payload.province, 120);
  if (!province) return invalid;

  const notes = clean(payload.notes, 2000);
  if (notes === null) return invalid;

  // Slugs become human labels here — the notification never echoes raw
  // client strings for the choice fields
  const personaLabel = labelFor(PERSONAS, persona);
  const request = {
    subject: `[Quote] ${personaLabel} · ${labelFor(projectOptions, projectType)} · ${name}`,
    persona: personaLabel,
    projectType: labelFor(projectOptions, projectType),
    deckSize: deckSize ? labelFor(DECK_SIZES, deckSize) : "Not provided",
    timeline: labelFor(TIMELINES, timeline),
    name,
    email,
    phone,
    city,
    province,
    notes,
  };

  // TODO: deliver `request` to OnDek. Nothing below this line sends anything.
  void request;

  return { ok: true };
}
