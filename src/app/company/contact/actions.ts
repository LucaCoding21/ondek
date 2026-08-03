"use server";

/**
 * PLACEHOLDER DESTINATION — wire this up before the page goes live.
 *
 * This action validates the message and reports success, but it DELIVERS
 * NOWHERE: there is no database, mail service, or CRM in this project yet, so a
 * submitted message is dropped on the floor. That matters more here than on the
 * dealer form — this one accepts warranty claims and quote requests — so until
 * it is wired up, the phone number and email address on the page are the only
 * routes that actually reach OnDek.
 *
 * Before launch, send `fields` to whatever OnDek actually reads — an inbox, a
 * CRM, a webhook — and return `ok: false` with a message when that call fails.
 *
 * Validation is hand-rolled on purpose: zod is not a dependency here.
 */

export type ContactFormState = {
  ok: boolean;
  /** Keyed by field name; rendered under the input it belongs to */
  errors: Record<string, string>;
  /** What was submitted, echoed back so the fields can be refilled — React
   *  resets an uncontrolled form once the action returns, so without this a
   *  single missing field would clear the rest */
  values?: Record<string, string>;
  message: string;
};

const REQUIRED_FIELDS: Record<string, string> = {
  name: "your name",
  email: "an email address",
  topic: "what this is about",
  message: "a message",
};

/** Four fields, all of them required. Anything else — a phone number, the size
 *  of the deck — belongs in the message, where it costs no extra input. */
const OPTIONAL_FIELDS: string[] = [];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function read(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const fields: Record<string, string> = {};
  for (const key of [...Object.keys(REQUIRED_FIELDS), ...OPTIONAL_FIELDS]) {
    fields[key] = read(formData, key);
  }

  const errors: Record<string, string> = {};

  for (const [key, label] of Object.entries(REQUIRED_FIELDS)) {
    if (!fields[key]) errors[key] = `Please enter ${label}.`;
  }

  if (fields.email && !EMAIL.test(fields.email)) {
    errors.email = "That email address doesn't look right.";
  }

  // Enough to answer without a round trip. Short enough that a genuine
  // one-liner still gets through.
  if (fields.message && fields.message.length < 15) {
    errors.message = "A little more detail will get you a better answer.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      values: fields,
      message: "Some details are missing. Check the fields marked below.",
    };
  }

  // TODO: deliver `fields` to OnDek. Nothing below this line sends anything.

  return {
    ok: true,
    errors: {},
    message: `Thanks, ${fields.name.split(" ")[0]}. Your message is in.`,
  };
}
