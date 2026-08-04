import type { PostBlock } from "@/lib/blogBodies";

/** Anchors are derived from the heading text, so the rail and the article
 *  can't drift apart the way a hand-kept list of ids would */
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function PostBody({
  blocks,
  source,
}: {
  blocks: PostBlock[];
  source: string;
}) {
  const contents = blocks
    .filter((block) => block.kind === "h2")
    .map((block) => (block as { text: string }).text);

  return (
    <section className="bg-background">
      <div className="w-full px-5 md:px-8 lg:px-12 xl:px-16 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-16 xl:gap-24 lg:items-start">
          {/* Contents rail, pinned while you read, same as the documents and
              FAQ pages. Hidden on a post short enough not to need one. */}
          {contents.length > 2 && (
            <nav
              aria-label="On this page"
              className="hidden lg:block lg:sticky lg:top-32"
            >
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-foreground/45">
                On this page
              </p>
              <ul className="mt-6 border-t border-foreground/15">
                {contents.map((heading) => (
                  <li key={heading}>
                    <a
                      href={`#${slugify(heading)}`}
                      className="block border-b border-foreground/15 py-3.5 text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* No entrance animation on the article itself — long-form copy
              reads best arriving static, so only the PostHero above moves */}
          <div
            className={
              contents.length > 2 ? "max-w-3xl" : "mx-auto max-w-3xl lg:col-span-2"
            }
          >
            <div className="flex flex-col gap-7">
              {blocks.map((block, i) => {
                if (block.kind === "h2") {
                  return (
                    <h2
                      key={i}
                      id={slugify(block.text)}
                      className="mt-8 scroll-mt-32 font-bold leading-[1.15] tracking-[-0.02em] text-[clamp(1.5rem,2.4vw,2rem)] first:mt-0"
                    >
                      {block.text}
                    </h2>
                  );
                }

                if (block.kind === "h3") {
                  return (
                    <h3 key={i} className="mt-4 text-lg font-bold leading-snug">
                      {block.text}
                    </h3>
                  );
                }

                if (block.kind === "ul") {
                  return (
                    <ul key={i} className="flex flex-col gap-4">
                      {block.items.map((item) => (
                        <li key={item} className="flex gap-4">
                          <span
                            aria-hidden
                            className="mt-2.5 size-1.5 shrink-0 bg-cta"
                          />
                          <span className="text-foreground/70 leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p
                    key={i}
                    className="text-lg text-foreground/75 leading-relaxed"
                  >
                    {block.text}
                  </p>
                );
              })}
            </div>

            <p className="mt-14 border-t border-foreground/15 pt-6 text-sm text-foreground/50">
              Originally published on{" "}
              <a
                href={source}
                target="_blank"
                rel="noopener"
                className="font-bold text-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
              >
                ondekvinylworx.com
              </a>
              <span className="sr-only">, opens in a new tab</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
