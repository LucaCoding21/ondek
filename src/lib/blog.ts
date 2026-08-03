import { POST_BODIES, type PostBlock } from "@/lib/blogBodies";

export type BlogCategory =
  | "product-basics"
  | "installation"
  | "care"
  | "ultra-system"
  | "design-ideas";

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  "product-basics": "Product basics",
  installation: "Installation",
  care: "Care & maintenance",
  "ultra-system": "The Ultra system",
  "design-ideas": "Design ideas",
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** Display string — these are published dates, not sortable data */
  date: string;
  category: BlogCategory;
  image: string;
  /** Where the article was originally published, credited on the post page */
  href: string;
};

/** Every post reads at /resources/blog/<slug> */
export function postPath(post: Pick<BlogPost, "slug">) {
  return `/resources/blog/${post.slug}`;
}

export function postBody(slug: string): PostBlock[] {
  return POST_BODIES[slug] ?? [];
}

export function getPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/** 200 wpm, rounded up, with a floor of one minute */
export function readMinutes(slug: string) {
  const words = postBody(slug)
    .map((block) => (block.kind === "ul" ? block.items.join(" ") : block.text))
    .join(" ")
    .split(/\s+/).length;

  return Math.max(1, Math.round(words / 200));
}

/** The rest of the set, newest first, for the foot of a post */
export function relatedPosts(slug: string, limit = 3) {
  const current = getPost(slug);
  const others = BLOG_POSTS.filter((post) => post.slug !== slug);
  const sameCategory = others.filter(
    (post) => post.category === current?.category
  );

  return [...sameCategory, ...others.filter((p) => !sameCategory.includes(p))]
    .slice(0, limit);
}

/** Newest first — the first entry is what the page features */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-clean-and-maintain-a-vinyl-deck",
    title: "How to clean and maintain a vinyl deck (the complete guide)",
    excerpt:
      "A vinyl decking membrane is about as low maintenance as outdoor surfaces get. Here is the quarterly routine, what to keep off the surface, and how to clear snow without marking the vinyl.",
    date: "March 17, 2026",
    category: "care",
    image: "/images/projects/grey-deck-black-railing.webp",
    href: "https://ondekvinylworx.com/how-to-clean-and-maintain-a-vinyl-deck-the-complete-guide/",
  },
  {
    slug: "ultra-edge",
    title: "Ultra Edge",
    excerpt:
      "The edge is where most decks start to fail. A closer look at how the Ultra Edge terminates the membrane over the perimeter and takes water clear of the structure below.",
    date: "February 10, 2026",
    category: "ultra-system",
    image: "/images/deck-edge-detail.webp",
    href: "https://ondekvinylworx.com/ultra-edge/",
  },
  {
    slug: "ultra-seam",
    title: "Ultra Seam",
    excerpt:
      "Where several vinyl runs are needed, UltraSeam welds PVC to PVC rather than bonding through fleece, giving a continuous membrane with no contaminated seams.",
    date: "February 10, 2026",
    category: "ultra-system",
    image: "/images/ultra-hero-deck.webp",
    href: "https://ondekvinylworx.com/ultra-seam/",
  },
  {
    slug: "under-deck-living-space",
    title:
      "Creating a functional living space under your waterproof deck",
    excerpt:
      "Transform your outdoor deck into a multifunctional extension of your home. When the deck above is genuinely waterproof, the space underneath becomes usable square footage.",
    date: "March 13, 2024",
    category: "design-ideas",
    image: "/images/under-deck-living.webp",
    href: "https://ondekvinylworx.com/enhancing-your-home-with-ondek-vinyl-worx-creating-a-functional-living-space-under-your-waterproof-deck/",
  },
  {
    slug: "become-an-installer",
    title: "How can I become an installer for OnDek vinyl decking?",
    excerpt:
      "A professional installer is necessary for OnDek Vinyl Worx. What the training covers, and how to join the dealer network.",
    date: "April 2, 2021",
    category: "installation",
    image: "/images/projects/cedar-post-forest-deck.webp",
    href: "https://ondekvinylworx.com/how-can-i-become-an-installer-for-ondek-vinyl-decking/",
  },
  {
    slug: "floors-or-roofing",
    title: "Is vinyl deck membrane to be used on floors or for roofing?",
    excerpt:
      "OnDek Vinyl Worx deck membrane is both a flooring material and a roofing material, which is exactly why it works over living space.",
    date: "March 31, 2021",
    category: "product-basics",
    image: "/images/projects/deck-edge-over-lawn.webp",
    href: "https://ondekvinylworx.com/is-vinyl-deck-membrane-to-be-used-on-floors-or-for-roofing/",
  },
  {
    slug: "leaks-around-railing-posts",
    title: "Will vinyl decking leak around the railing posts?",
    excerpt:
      "Posts are the most common leak concern on a waterproof deck. How the membrane is detailed around surface-mounted and rectangular posts.",
    date: "March 27, 2021",
    category: "installation",
    image: "/images/projects/glass-railing-lakeside.webp",
    href: "https://ondekvinylworx.com/will-vinyl-decking-leak-around-the-railing-posts/",
  },
  {
    slug: "wheelchair-ramps-and-other-uses",
    title: "Can vinyl deck membrane be used for wheelchair ramps?",
    excerpt:
      "Make your wheelchair ramp a lot safer by reinforcing it with a vinyl deck membrane, plus the other surfaces the product is suited to.",
    date: "March 26, 2021",
    category: "product-basics",
    image: "/images/projects/hillside-deck-autumn.webp",
    href: "https://ondekvinylworx.com/can-vinyl-deck-membrane-be-used-for-wheelchair-ramps-or-other-uses/",
  },
  {
    slug: "furniture-damage",
    title: "Will furniture cause damage to my vinyl decking membrane?",
    excerpt:
      "Vinyl decking membranes are durable, leak-proof options for homeowners and business owners. What to watch for when you furnish the deck.",
    date: "March 25, 2021",
    category: "care",
    image: "/images/projects/lake-view-glass-railing.webp",
    href: "https://ondekvinylworx.com/will-furniture-cause-damage-to-my-vinyl-decking-membrane/",
  },
];

export const FEATURED_POST = BLOG_POSTS[0];
export const GRID_POSTS = BLOG_POSTS.slice(1);

/** Only the categories that actually have posts in the grid, in fixed order */
export const BLOG_CATEGORIES = (
  Object.keys(BLOG_CATEGORY_LABELS) as BlogCategory[]
).filter((category) => GRID_POSTS.some((post) => post.category === category));
