"use server";

/**
 * PLACEHOLDER DESTINATION — wire this up before the page goes live.
 *
 * This action validates the design kit request and reports success, but it
 * DELIVERS NOWHERE: there is no database, mail service, or CRM in this project
 * yet, so a submitted request is dropped on the floor. Before launch, send
 * `payload` to whatever OnDek actually reads — an inbox, a CRM, a webhook —
 * and return `ok: false` when that call fails.
 *
 * Fields mirror the old site's design kit form: who you are, name, email,
 * phone, and a full mailing address, since the kit ships physically. The
 * wizard gates each step client-side; this re-checks everything server-side.
 */

export type KitPayload = {
  role: string;
  name: string;
  email: string;
  phone: string;
  street: string;
  address2: string;
  city: string;
  postal: string;
  country: string;
  /** Honeypot — off-screen for people, filled in by bots */
  website: string;
};

export type KitResult = { ok: boolean; error?: string };

const REQUIRED: (keyof KitPayload)[] = [
  "role",
  "name",
  "email",
  "phone",
  "street",
  "city",
  "postal",
  "country",
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitKitRequest(
  payload: KitPayload,
): Promise<KitResult> {
  // A filled honeypot is a bot: report success and send nothing
  if (payload.website) return { ok: true };

  for (const key of REQUIRED) {
    if (!payload[key]?.trim()) {
      return { ok: false, error: "Some details are missing. Check the fields and try again." };
    }
  }

  if (!EMAIL.test(payload.email)) {
    return { ok: false, error: "That email address doesn't look right." };
  }

  if (payload.phone.replace(/\D/g, "").length < 10) {
    return { ok: false, error: "Please enter a phone number we can reach you on." };
  }

  // TODO: deliver `payload` to OnDek. Nothing below this line sends anything.

  return { ok: true };
}
