export type DocCategory = "install" | "spec" | "warranty" | "care";

export const DOC_CATEGORY_LABELS: Record<DocCategory, string> = {
  install: "Install guides",
  spec: "Spec sheets & tech data",
  warranty: "Warranty documents",
  care: "Maintenance & care",
};

export const DOC_CATEGORY_BLURBS: Record<DocCategory, string> = {
  install:
    "Technical drawings for common OnDek deck details: edges, walls, drains, corners and posts. Designed in conjunction with our complete line of components: adhesives, flashing, and trims.",
  spec: "Approvals, product data and safety data sheets for the membrane, the adhesives, and everything that goes down with them.",
  warranty:
    "The 15 Year Waterproofing / 5 Year Appearance warranty, and what it covers.",
  care: "The quarterly routine that keeps a deck looking the way it did on day one.",
};

/** Order the categories render in — matches the sitemap */
export const DOC_CATEGORIES: DocCategory[] = [
  "install",
  "spec",
  "warranty",
  "care",
];

export type OndekDocument = {
  title: string;
  category: DocCategory;
  /** Sub-heading within a category; the drawings carry their own groupings */
  group?: string;
  /** Drawing number, shown in place of a blurb on the detail drawings */
  code?: string;
  format: "PDF" | "Web";
  href: string;
  blurb?: string;
};

/** Every href here was taken from the published resources section — no URL on
 *  this page is constructed or guessed. */
export const DOCUMENTS: OndekDocument[] = [
  // ── Install guides ───────────────────────────────────────────────────────
  {
    title: "Installation videos",
    category: "install",
    group: "Walkthroughs",
    format: "Web",
    href: "/resources/videos",
    blurb:
      "Visual walkthroughs of installation steps, system components, and the mistakes that cause callbacks.",
  },

  {
    title: "Drip Edge with Adhered Membrane",
    category: "install",
    group: "Perimeter & edges",
    code: "101",
    format: "PDF",
    href: "/documents/101-Drip-Edge-with-Adhered-Membrane.pdf",
  },
  {
    title: "Assembled Edge Termination Bar",
    category: "install",
    group: "Perimeter & edges",
    code: "106",
    format: "PDF",
    href: "/documents/106-Assembled-Edge-Termination-Bar.pdf",
  },
  {
    title: "Assembled Outside Perimeter",
    category: "install",
    group: "Perimeter & edges",
    code: "110",
    format: "PDF",
    href: "/documents/110-Assembled-Outside-Perimeter.pdf",
  },
  {
    title: "Perimeter Flashing Detail (Plywood)",
    category: "install",
    group: "Perimeter & edges",
    code: "111",
    format: "PDF",
    href: "/documents/111-Assembled-Outside-Perimeter-Flashing-Detail-Plywood.pdf",
  },
  {
    title: "Perimeter Flashing Detail (Concrete)",
    category: "install",
    group: "Perimeter & edges",
    code: "112",
    format: "PDF",
    href: "/documents/112-Assembled-Outside-Perimeter-Flashing-Detail-Concrete.pdf",
  },
  {
    title: "Outside Edge Detail",
    category: "install",
    group: "Perimeter & edges",
    code: "119",
    format: "PDF",
    href: "/documents/119-Outside-Edge-Detail.pdf",
  },
  {
    title: "Outside Edge Detail (L-Trim)",
    category: "install",
    group: "Perimeter & edges",
    code: "120",
    format: "PDF",
    href: "/documents/120-Outside-Edge-Detail-LTrim.pdf",
  },

  {
    title: "Deck Edge Before Siding",
    category: "install",
    group: "Wall & door transitions",
    code: "104",
    format: "PDF",
    href: "/documents/104-Deck-Edge-Before-Siding.pdf",
  },
  {
    title: "Door Frame with Membrane",
    category: "install",
    group: "Wall & door transitions",
    code: "105",
    format: "PDF",
    href: "/documents/105-Door-Frame-with-Membrane.pdf",
  },
  {
    title: "Assembled Masonry Wall Detail",
    category: "install",
    group: "Wall & door transitions",
    code: "107",
    format: "PDF",
    href: "/documents/107-Assembled-Masonary-Wall-Detail.pdf",
  },
  {
    title: "Deck to Wall Detail",
    category: "install",
    group: "Wall & door transitions",
    code: "108",
    format: "PDF",
    href: "/documents/108-Deck-to-Wall-Detail.pdf",
  },
  {
    title: "Single Gum Shoe Wall Detail",
    category: "install",
    group: "Wall & door transitions",
    code: "109",
    format: "PDF",
    href: "/documents/109-Single-Gum-Shoe-Wall-Detail.pdf",
  },
  {
    title: "Stucco Detail",
    category: "install",
    group: "Wall & door transitions",
    code: "118",
    format: "PDF",
    href: "/documents/118-Stucco-Detail.pdf",
  },
  {
    title: "Wall Saddle Detail",
    category: "install",
    group: "Wall & door transitions",
    code: "124",
    format: "PDF",
    href: "/documents/124-Wall-Saddle-Detail.pdf",
  },

  {
    title: "Assembled Scupper Box Detail",
    category: "install",
    group: "Drainage",
    code: "114",
    format: "PDF",
    href: "/documents/114-Assembled-Scupper-Box-Detail.pdf",
  },
  {
    title: "Overflow Drain Detail",
    category: "install",
    group: "Drainage",
    code: "115",
    format: "PDF",
    href: "/documents/115-Overflow-Drain-Detail.pdf",
  },
  {
    title: "Drain Detail",
    category: "install",
    group: "Drainage",
    code: "121",
    format: "PDF",
    href: "/documents/121-Drain-Detail.pdf",
  },
  {
    title: "PVC Coated Drain Detail",
    category: "install",
    group: "Drainage",
    code: "122",
    format: "PDF",
    href: "/documents/122-PVC-Coated-Drain-Detail.pdf",
  },

  {
    title: "Outside Corner Membrane",
    category: "install",
    group: "Corners & seams",
    code: "103",
    format: "PDF",
    href: "/documents/103-Outside-Corner-Membrane.pdf",
  },
  {
    title: "Pre-Installed Finishing Strip Detail",
    category: "install",
    group: "Corners & seams",
    code: "116",
    format: "PDF",
    href: "/documents/116-Pre-installed-Finishing-Strip-Detail.pdf",
  },
  {
    title: "Ultra Seam Perma Welding",
    category: "install",
    group: "Corners & seams",
    code: "123",
    format: "PDF",
    href: "/documents/123-Ultra-Seam-Perma-Welding.pdf",
  },

  {
    title: "Rectangular Post with Membrane",
    category: "install",
    group: "Posts & penetrations",
    code: "102",
    format: "PDF",
    href: "/documents/102-Rectangular-Post-with-Membrane.pdf",
  },
  {
    title: "Surface Mounted Post with Pedestal Detail",
    category: "install",
    group: "Posts & penetrations",
    code: "113",
    format: "PDF",
    href: "/documents/113-Surface-Mounted-Post-with-Pedestal-Detail.pdf",
  },
  {
    title: "Surface Mounted Post Detail",
    category: "install",
    group: "Posts & penetrations",
    code: "117",
    format: "PDF",
    href: "/documents/117-Surface-Mounted-Post-Detail.pdf",
  },

  // ── Spec sheets & tech data ──────────────────────────────────────────────
  {
    title: "QAI Approval Document",
    category: "spec",
    group: "Approvals & testing",
    format: "PDF",
    href: "/documents/QAI-Approval-Document-June-27-2025.pdf",
    blurb:
      "Quality assurance certification, June 27 2025. QAI audits the factory quarterly to confirm every process and chemical compound still meets the original specification.",
  },
  {
    title: "OD 1010 Product Data Sheet",
    category: "spec",
    group: "Adhesive",
    format: "PDF",
    href: "/documents/PDS-OD1010.pdf",
    blurb:
      "Coverage, application temperatures, open time, and the full technical data for the pail.",
  },
  {
    title: "OD 1010 Safety Data Sheet",
    category: "spec",
    group: "Adhesive",
    format: "PDF",
    href: "/documents/SDS-OD1010.pdf",
    blurb:
      "Handling, storage, hazard classification, and first-aid information for the job site.",
  },
  {
    title: "Vinyl Membrane Safety Data Sheet",
    category: "spec",
    group: "Safety data sheets",
    format: "PDF",
    href: "/documents/MSDS-KQ-Vinyl-Membrane.pdf",
    blurb: "SDS for the OnDek Vinyl Worx membrane itself.",
  },
  {
    title: "DuraPro YAF3275-D Latex Adhesive",
    category: "spec",
    group: "Safety data sheets",
    format: "PDF",
    href: "/documents/AM3275_SDS_EN.pdf",
  },
  {
    title: "Helmiprene 1010 Adhesive",
    category: "spec",
    group: "Safety data sheets",
    format: "PDF",
    href: "/documents/Helmiprene-1010-Canada.pdf",
  },
  {
    title: "Mapei PlaniPatch Floor Filler",
    category: "spec",
    group: "Safety data sheets",
    format: "PDF",
    href: "/documents/PLANIPATCH-SDS-EN.pdf",
  },
  {
    title: "MasterSeal NP1 Caulking",
    category: "spec",
    group: "Sealants & tapes",
    format: "PDF",
    href: "/documents/NP1-DATA.pdf",
  },
  {
    title: "Tacky Tape SM5227",
    category: "spec",
    group: "Sealants & tapes",
    format: "PDF",
    href: "/documents/SM-BUTYL-TAPE-DATA.pdf",
  },
  {
    title: "Mulco Supra Expert Caulking",
    category: "spec",
    group: "Sealants & tapes",
    format: "PDF",
    href: "/documents/MULCO-EXPERT-DATA.pdf",
  },

  // ── Warranty ─────────────────────────────────────────────────────────────
  {
    title: "OnDek Vinyl Worx Warranty",
    category: "warranty",
    format: "PDF",
    href: "/documents/ONDEK-VINYL-WORX-WARRANTY-20feb2020.pdf",
    blurb:
      "The 15 Year Waterproofing / 5 Year Appearance warranty in full, including what falls outside it.",
  },
  {
    title: "Warranty & care overview",
    category: "warranty",
    format: "Web",
    href: "/vinyl-decking/warranty",
    blurb:
      "What the coverage includes in plain language, and how to register a claim.",
  },

  // ── Maintenance & care ───────────────────────────────────────────────────
  {
    title: "Cleaning & maintenance guide",
    category: "care",
    format: "PDF",
    href: "/documents/ONDEK-Care-and-Cleaning-20feb2020.pdf",
    blurb:
      "The four-times-a-year routine: mild soap, water, a soft brush, and a garden hose. Also covers de-icers and snow removal.",
  },
];

export const DOCUMENT_COUNT = DOCUMENTS.length;
