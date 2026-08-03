import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import {
  BLOG_CATEGORY_LABELS,
  postPath,
  type BlogPost,
} from "@/lib/blog";

export default function PostFooter({ posts }: { posts: BlogPost[] }) {
  // Same card anatomy as the index grid, so the foot of a post is a smaller
  // version of the page it came from rather than a new pattern
  return (
    <section className="bg-surface">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(1.75rem,3vw,2.5rem)]">
            Keep reading
          </h2>

          <Link
            href="/resources/blog"
            className="group inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-foreground/70 transition-colors hover:text-foreground"
          >
            All posts
            <svg
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M2.5 8h11m0 0L9.5 4m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </Reveal>

        <Reveal stagger=".related-card" className="mt-12 lg:mt-16">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug} className="related-card">
                <Link
                  href={postPath(post)}
                  className="group flex h-full flex-col overflow-hidden rounded-xl bg-background ring-1 ring-foreground/10 transition-shadow hover:shadow-xl"
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-baseline justify-between gap-4 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-foreground/50">
                      {BLOG_CATEGORY_LABELS[post.category]}
                      <span className="shrink-0 text-xs font-normal normal-case tracking-normal text-foreground/45">
                        {post.date}
                      </span>
                    </p>

                    <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug decoration-1 underline-offset-4 group-hover:underline">
                      {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm text-foreground/60 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
