export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Vinyl decking",
    href: "/vinyl-decking",
    children: [
      { label: "Designs & colours", href: "/vinyl-decking/designs-colours" },
      { label: "The Ultra system", href: "/vinyl-decking/the-ultra-system" },
      { label: "Adhesive", href: "/vinyl-decking/adhesive" },
      { label: "Warranty", href: "/vinyl-decking/warranty" },
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
