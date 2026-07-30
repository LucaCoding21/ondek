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
  {
    label: "Why vinyl",
    href: "/why-vinyl",
    children: [
      { label: "Why vinyl", href: "/why-vinyl" },
      {
        label: "Under-deck living space",
        href: "/why-vinyl/under-deck-living-space",
      },
    ],
  },
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
