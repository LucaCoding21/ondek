/** Every number, address and address-line here is taken verbatim from OnDek's
 *  published contact page. The one edit is the opening hours, which the source
 *  renders as "700 am - 400 pm" — that's a typo in the source, not a format. */

export type Office = {
  id: string;
  country: string;
  city: string;
  /** Address on the lines it should break on */
  address: string[];
  /**
   * The same address in parts, for the schema.org PostalAddress in
   * `contactJsonLd.ts`. Kept as its own field rather than parsed out of the
   * display lines above, so rewording the visible address can't silently
   * corrupt the structured data — but the two DO need to stay in step. If you
   * change one, change the other.
   */
  postal: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    /** ISO 3166-1 alpha-2 */
    addressCountry: string;
  };
  phones: { label: string; display: string; href: string }[];
  /** Fax has no href — nobody is dialling it from a phone */
  fax?: string;
  email: string;
};

export const OFFICES: Office[] = [
  {
    id: "canada",
    country: "Canada",
    city: "Aldergrove, British Columbia",
    address: ["101 – 26730 56 Ave.", "Aldergrove, BC", "Canada V4W 3X5"],
    postal: {
      streetAddress: "101 – 26730 56 Ave.",
      addressLocality: "Aldergrove",
      addressRegion: "BC",
      postalCode: "V4W 3X5",
      addressCountry: "CA",
    },
    phones: [
      {
        label: "Toll free",
        display: "1-866-966-6335",
        href: "tel:+18669666335",
      },
      { label: "Tel", display: "604-625-1159", href: "tel:+16046251159" },
    ],
    fax: "604-625-1194",
    email: "info@ondekvinylworx.com",
  },
  {
    id: "usa",
    country: "USA",
    city: "Wellsville, Ohio",
    address: ["409 Broadway", "Wellsville, OH", "USA 43968"],
    postal: {
      streetAddress: "409 Broadway",
      addressLocality: "Wellsville",
      addressRegion: "OH",
      postalCode: "43968",
      addressCountry: "US",
    },
    phones: [
      { label: "Tel", display: "216-389-2212", href: "tel:+12163892212" },
    ],
    email: "info@ondekvinylworx.com",
  },
];

/** No time zone is stated on the source and the two offices sit in different
 *  ones, so none is claimed here */
export const HOURS = {
  days: "Monday – Friday",
  time: "7:00 am – 4:00 pm",
  note: "Closed on all statutory holidays and Boxing Day.",
  /** The same hours in the 24-hour form schema.org wants. Change alongside
   *  `days` and `time` above — these three describe one thing. */
  schema: {
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ] as const,
    opens: "07:00",
    closes: "16:00",
  },
};

export type Person = {
  name: string;
  /** Job title and region exactly as published — not widened into a coverage
   *  claim the source doesn't make */
  role: string;
  phone?: { display: string; href: string };
  email: string;
};

/** The three groups are the published site's own, not an arrangement of ours.
 *  Note the front office addresses sit on the parent company's domain —
 *  Innovative Aluminum Systems — which is how they are listed. */
export const TEAM_GROUPS: { id: string; title: string; people: Person[] }[] = [
  {
    id: "sales",
    title: "Sales inquiries",
    people: [
      {
        name: "Jim Szlabon",
        role: "Business Development, Western United States & Canada",
        phone: { display: "604-625-1159", href: "tel:+16046251159" },
        email: "jim@ondekvinylworx.com",
      },
      {
        name: "Grant Barlow",
        role: "Business Development, Central & Eastern United States",
        phone: { display: "216-389-2212", href: "tel:+12163892212" },
        email: "grant@ondekvinylworx.com",
      },
    ],
  },
  {
    id: "customer-service",
    title: "Customer service",
    people: [
      {
        name: "Rod Hobeyn",
        role: "Customer Service Representative",
        email: "rod@ondekvinylworx.com",
      },
    ],
  },
  {
    id: "front-office",
    title: "Front office",
    people: [
      {
        name: "Carolyn Hobeyn",
        role: "Office Manager",
        email: "carolyn@innovativealuminum.com",
      },
      {
        name: "Fred Hobeyn",
        role: "President",
        email: "fred@innovativealuminum.com",
      },
    ],
  },
];

export const GENERAL_EMAIL = "info@ondekvinylworx.com";
export const TOLL_FREE = { display: "1-866-966-6335", href: "tel:+18669666335" };
