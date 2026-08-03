export type Faq = { q: string; a: string };

export type FaqCategory = {
  id: string;
  title: string;
  blurb: string;
  faqs: Faq[];
};

/** Every answer traces back to the published FAQ, the warranty, or the care &
 *  maintenance guide — nothing is stated here that isn't in one of the three.
 *  Cleaning is phrased as "four times a year" throughout so this page and the
 *  warranty page don't describe the same routine two different ways. */
export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "product-and-installation",
    title: "Product & installation",
    blurb: "What the membrane is, how it's made, and how it goes down.",
    faqs: [
      {
        q: "What is OnDek Vinyl Worx?",
        a: "OnDek Vinyl Worx is a polyvinyl chloride (PVC) product, used outdoors wherever waterproofing is required: decks, patios, balconies, walkways and roof decks. A non-woven polyester backing carries the adhesive bond, and the membrane is supplied in 72\" × 300 foot rolls.",
      },
      {
        q: "How is OnDek Vinyl Worx manufactured?",
        a: "The product is manufactured in master rolls of 300 feet. Advanced equipment lets us custom cut to multiple sizes, which reduces both project waste and the number of seams in a finished deck.",
      },
      {
        q: "How is OnDek Vinyl Worx installed?",
        a: "The membrane is adhered to a plywood or concrete substrate using our specially formulated contact (solvent-based) adhesive; a latex adhesive may also be used. Where several sections are needed, they are overlapped by 3/4 to 1 inch minimum and thermally bonded together with a hot air gun.",
      },
      {
        q: "What is UltraSeam?",
        a: "UltraSeam provides the ultimate weld in situations where several vinyl runs are required. One side carries no fleece or woven material, so overlapped sections weld PVC to PVC, giving a continuous waterproofing membrane with no contamination in the seam.",
      },
      {
        q: "Why is OnDek Vinyl Worx better than a standard wood deck?",
        a: "It asks very little in the way of maintenance, waterproofs in a single step, meets ADA standards for slip resistance, comes in patterns worth looking at, and is manufactured without harvesting trees.",
      },
    ],
  },
  {
    id: "performance-and-testing",
    title: "Performance & testing",
    blurb: "How long it lasts, and what it has been tested against.",
    faqs: [
      {
        q: "How long will OnDek Vinyl Worx last?",
        a: "Longevity depends on UV exposure, maintenance, the chemicals used on the surface, and foot traffic. Following the cleaning and maintenance guide is what gets you the full life out of the product.",
      },
      {
        q: "Is OnDek Vinyl Worx tested?",
        a: "Yes. Our membranes are Canadian General Standards Board (CGSB) approved and comply with CAN/CGSB 37.54.",
      },
      {
        q: "Will it stand up to extreme heat or freezing temperatures?",
        a: "Our products are tested from -40° to 80° Celsius (-40°F to 176°F), for installation across North American climates.",
      },
    ],
  },
  {
    id: "care-and-maintenance",
    title: "Care & maintenance",
    blurb: "Soap, water, a garden hose, and what to keep off the surface.",
    faqs: [
      {
        q: "How do I clean and maintain my OnDek deck?",
        a: "Clean the deck surface four times a year using a mild soap and water. Agitate it over the surface with a mop or soft brush on a stick, then rinse thoroughly with a garden hose.",
      },
      {
        q: "Can I put de-icer on my OnDek surface?",
        a: "We recommend against using any de-icing materials on OnDek Vinyl Worx products, as some de-icers may cause premature fading or discolouring of the vinyl membrane.",
      },
      {
        q: "How should snow be removed?",
        a: "Use a plastic shovel to remove snow from your vinyl deck, and check that the shovel has no sharp edges before you start.",
      },
    ],
  },
  {
    id: "warranty",
    title: "Warranty & support",
    blurb: "What's covered, for how long, and what we don't ask of you.",
    faqs: [
      {
        q: "Does OnDek Vinyl Worx come with a warranty?",
        a: "Yes. We are pleased to offer our customers a 15 Year Waterproofing / 5 Year Appearance warranty.",
      },
      {
        q: "What happens if the waterproofing is compromised?",
        a: "If the waterproofing is compromised during the warranty period because of a manufacturer's defect, OnDek Vinyl Worx will repair or replace the affected area.",
      },
      {
        q: "Is fading covered?",
        a: "Fading or discolouration that is excessive, over and above what would be considered natural aging, is covered, and that coverage runs five years.",
      },
      {
        q: "Do the seams need an annual inspection?",
        a: "No. UltraSeam performs a vinyl to vinyl weld, so seams are free of contamination and stronger than the vinyl itself. We don't expect seams to separate and we don't require annual inspections.",
      },
    ],
  },
];

export const FAQ_COUNT = FAQ_CATEGORIES.reduce(
  (total, category) => total + category.faqs.length,
  0
);
