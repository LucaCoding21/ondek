export type NavLink = {
  label: string;
  href: string;
  /** Photo card in the mega menu — only read on a `mega` item's children */
  image?: string;
  /** One short line revealed on card hover in the mega menu */
  desc?: string;
};

export type NavItem = NavLink & {
  children?: NavLink[];
  /** Opens the full-width photo panel instead of the compact dropdown */
  mega?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Vinyl decking",
    href: "/vinyl-decking",
    mega: true,
    children: [
      {
        label: "Designs & colours",
        href: "/vinyl-decking/designs-colours",
        image: "/images/designs/swatches/speckled-stone-grey.jpg",
        desc: "12+ designs in greys, silvers, tans, and browns",
      },
      {
        label: "The Ultra system",
        href: "/vinyl-decking/the-ultra-system",
        image: "/images/ultra-hero-deck.webp",
        desc: "Ultra Seam welds and the screw-free Ultra Edge",
      },
      {
        label: "Adhesive",
        href: "/vinyl-decking/adhesive",
        image: "/images/adhesive-hero-pail-v3.webp",
        desc: "OD 1010, formulated for fleece-back membranes",
      },
      {
        label: "Warranty",
        href: "/vinyl-decking/warranty",
        image: "/images/grey-deck-farmhouse-wide.jpg",
        desc: "15 year waterproofing, 5 year appearance",
      },
    ],
  },
  // No children: under-deck living space is a section of this page rather
  // than a page of its own — it's what the waterproofing argument buys you,
  // not a parallel topic.
  { label: "Why vinyl", href: "/why-vinyl" },
  { label: "Become a dealer", href: "/become-a-dealer" },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Blog", href: "/resources/blog" },
      { label: "FAQs", href: "/resources/faqs" },
      { label: "Documents", href: "/resources/documents" },
      { label: "Videos", href: "/resources/videos" },
    ],
  },
  {
    label: "Company",
    href: "/company",
    children: [
      { label: "About", href: "/company/about" },
      { label: "Contact", href: "/company/contact" },
    ],
  },
];

export const CTA_LINKS = {
  designKit: { label: "Free design kit", href: "/free-design-kit" },
  quote: { label: "Get a quote", href: "/get-a-quote" },
};
