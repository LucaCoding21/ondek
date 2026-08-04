// Option lists for the quote wizard. Shared between the client component
// (which renders them) and the server action (which validates against them)
// so the two can never drift apart. Values are slugs; the action maps them
// back to labels before anything leaves the server.

export const PERSONAS = [
  {
    value: "homeowner",
    label: "A homeowner",
    description: "Planning a new deck or fixing the one you have",
  },
  {
    value: "contractor",
    label: "A contractor",
    description: "Pricing vinyl decking for a client's build",
  },
  {
    value: "property-manager",
    label: "A property manager",
    description: "Looking after decks or balconies across a building",
  },
  {
    value: "designer",
    label: "An architect or designer",
    description: "Specifying deck membranes for a project",
  },
] as const;

export type Persona = (typeof PERSONAS)[number]["value"];

export type Option = { value: string; label: string };

export const PROJECT_TYPES: Record<Persona, Option[]> = {
  homeowner: [
    { value: "new-deck", label: "Building a new deck" },
    { value: "replace-vinyl", label: "Replacing old vinyl" },
    { value: "resurface", label: "Resurfacing wood or concrete" },
    { value: "not-sure", label: "Not sure yet" },
  ],
  contractor: [
    { value: "new-build", label: "New build" },
    { value: "redeck", label: "Re-deck or resurface" },
    { value: "multi-unit", label: "Multi-unit project" },
    { value: "ongoing-supply", label: "Ongoing supply" },
  ],
  "property-manager": [
    { value: "restoration", label: "Balcony or walkway restoration" },
    { value: "repairs", label: "Repairs to failing decks" },
    { value: "new-construction", label: "New construction" },
    { value: "assessment", label: "Not sure, need an assessment" },
  ],
  designer: [
    { value: "single-family", label: "Single-family spec" },
    { value: "multi-family", label: "Multi-family spec" },
    { value: "commercial", label: "Commercial spec" },
    { value: "research", label: "Comparing materials" },
  ],
};

export const DECK_SIZES: Option[] = [
  { value: "under-200", label: "Under 200 sq ft" },
  { value: "200-500", label: "200 – 500 sq ft" },
  { value: "500-1000", label: "500 – 1,000 sq ft" },
  { value: "over-1000", label: "Over 1,000 sq ft" },
  { value: "size-not-sure", label: "Not sure" },
];

export const TIMELINES: Option[] = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3-months", label: "1 – 3 months" },
  { value: "3-6-months", label: "3 – 6 months" },
  { value: "planning", label: "Just planning ahead" },
];
