import {
  GENERAL_EMAIL,
  HOURS,
  OFFICES,
  TEAM_GROUPS,
  TOLL_FREE,
} from "@/lib/contact";

/**
 * schema.org structured data for the contact page, built FROM `contact.ts`
 * rather than written out a second time. Edit an address, a phone number or the
 * opening hours in that file and this follows automatically — there is no
 * second copy to keep in step.
 *
 * Two things here are NOT derived and do need a human before launch:
 *
 *   1. SITE_URL below — currently the live WordPress domain. If the rebuild
 *      ships anywhere else, change it.
 *   2. LEGAL_NAME — taken from the published site's own wording.
 *
 * Deliberately conservative about what it claims. The sales roles read
 * "Western United States & Canada" and "Central & Eastern United States", which
 * is a partial territory; encoding that as schema's `areaServed` would either
 * lose the qualifier or overclaim whole countries, so it is left off. Front
 * office (Office Manager, President) is left out too — those are named people,
 * not public contact channels for the organisation.
 *
 * Validate any change at https://validator.schema.org/ or Google's Rich Results
 * Test before shipping.
 */

/** TODO: confirm before launch — this is the current live domain */
const SITE_URL = "https://ondekvinylworx.com";
const LEGAL_NAME = "OnDek Vinyl Worx Inc.";

/** "tel:+16046251159" -> "+16046251159" */
function toE164(href: string) {
  return href.replace(/^tel:/, "");
}

const openingHours = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [...HOURS.schema.dayOfWeek],
    opens: HOURS.schema.opens,
    closes: HOURS.schema.closes,
  },
];

function placeFor(office: (typeof OFFICES)[number]) {
  // The toll-free line first if there is one, since that is the number the
  // page leads with
  const primary = office.phones[0];

  return {
    "@type": "Place",
    name: `${LEGAL_NAME} — ${office.city}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: office.postal.streetAddress,
      addressLocality: office.postal.addressLocality,
      addressRegion: office.postal.addressRegion,
      postalCode: office.postal.postalCode,
      addressCountry: office.postal.addressCountry,
    },
    ...(primary ? { telephone: toE164(primary.href) } : {}),
    ...(office.fax ? { faxNumber: office.fax } : {}),
    email: office.email,
    openingHoursSpecification: openingHours,
  };
}

function salesContactPoints() {
  const sales = TEAM_GROUPS.find((group) => group.id === "sales");
  if (!sales) return [];

  return sales.people.map((person) => ({
    "@type": "ContactPoint",
    contactType: "sales",
    name: person.name,
    email: person.email,
    ...(person.phone ? { telephone: toE164(person.phone.href) } : {}),
    availableLanguage: "English",
  }));
}

export function buildContactJsonLd() {
  const [headOffice] = OFFICES;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: LEGAL_NAME,
    url: SITE_URL,
    email: GENERAL_EMAIL,
    // The membrane is manufactured in Aldergrove, so that is the registered
    // address; Wellsville is carried below as a second location
    address: {
      "@type": "PostalAddress",
      streetAddress: headOffice.postal.streetAddress,
      addressLocality: headOffice.postal.addressLocality,
      addressRegion: headOffice.postal.addressRegion,
      postalCode: headOffice.postal.postalCode,
      addressCountry: headOffice.postal.addressCountry,
    },
    location: OFFICES.map(placeFor),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: toE164(TOLL_FREE.href),
        email: GENERAL_EMAIL,
        availableLanguage: "English",
      },
      ...salesContactPoints(),
    ],
  };
}
