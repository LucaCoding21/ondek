"use server";

/**
 * PLACEHOLDER DESTINATION — wire this up before the page goes live.
 *
 * This action validates the dealer application and reports success, but it
 * DELIVERS NOWHERE: there is no database, mail service, or CRM in this project
 * yet, so a submitted application is dropped on the floor. Before launch, send
 * `fields` to whatever OnDek actually reads — an inbox, a CRM, a webhook — and
 * return `ok: false` with a message when that call fails.
 *
 * Validation is hand-rolled on purpose: zod is not a dependency here.
 */

export type DealerFormState = {
  ok: boolean;
  /** Keyed by field name; rendered under the input it belongs to */
  errors: Record<string, string>;
  /** What was submitted, echoed back so the fields can be refilled — React
   *  resets an uncontrolled form once the action returns, so without this a
   *  single missing field would clear all nine */
  values?: Record<string, string>;
  message: string;
};

const REQUIRED_FIELDS: Record<string, string> = {
  name: "your name",
  company: "your company name",
  email: "an email address",
  phone: "a phone number",
  city: "a city",
  province: "a province or state",
  trade: "the kind of work you do",
};

const OPTIONAL_FIELDS = ["volume", "notes"];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function read(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitDealerApplication(
  _prevState: DealerFormState,
  formData: FormData,
): Promise<DealerFormState> {
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

  // Ten digits is a North American number with or without the country code;
  // anything short of that is a typo rather than a format we don't know.
  if (fields.phone && fields.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Please enter a phone number we can reach you on.";
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
    message: `Thanks, ${fields.name.split(" ")[0]}. Your application is in.`,
  };
}
