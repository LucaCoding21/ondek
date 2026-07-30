import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function WhyVinyl() {
  return (
    <section className="bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                The last deck surface{" "}
                <span className="bg-cta box-decoration-clone px-1.5">
                  you&apos;ll ever install.
                </span>
              </h2>
            </Reveal>

            <Reveal className="relative mt-16 lg:mt-40">
              {/* registration corners, echoing a technical drawing */}
              <span
                aria-hidden
                className="absolute -top-2.5 -left-2.5 h-5 w-5 border-t-2 border-l-2 border-foreground/30"
              />
              <span
                aria-hidden
                className="absolute -top-2.5 -right-2.5 h-5 w-5 border-t-2 border-r-2 border-foreground/30"
              />
              <span
                aria-hidden
                className="absolute -bottom-2.5 -left-2.5 h-5 w-5 border-b-2 border-l-2 border-foreground/30"
              />
              <span
                aria-hidden
                className="absolute -bottom-2.5 -right-2.5 h-5 w-5 border-b-2 border-r-2 border-foreground/30"
              />

              <div className="bg-surface p-6 sm:p-8">
                <h3 className="text-xl font-bold">
                  100% waterproof. Not water-resistant.
                </h3>
                <p className="mt-3 text-foreground/70 leading-relaxed">
                  One sealed surface protects your deck structure for decades —
                  no staining, sealing, or sanding, slip-resistant when wet,
                  and UV-stable through freeze-thaw winters. Soap and water is
                  all it takes.
                </p>
              </div>
            </Reveal>

            <Reveal className="mt-8">
              <Link
                href="/why-vinyl"
                className="inline-block font-bold border-b-2 border-cta pb-0.5 hover:border-foreground transition-colors"
              >
                More on why vinyl wins
              </Link>
            </Reveal>
          </div>

          <Reveal className="relative lg:ml-16 lg:-mr-16">
            <span
              aria-hidden
              className="absolute -top-2.5 -left-2.5 h-5 w-5 border-t-2 border-l-2 border-foreground/30"
            />
            <span
              aria-hidden
              className="absolute -top-2.5 -right-2.5 h-5 w-5 border-t-2 border-r-2 border-foreground/30"
            />
            <span
              aria-hidden
              className="absolute -bottom-2.5 -left-2.5 h-5 w-5 border-b-2 border-l-2 border-foreground/30"
            />
            <span
              aria-hidden
              className="absolute -bottom-2.5 -right-2.5 h-5 w-5 border-b-2 border-r-2 border-foreground/30"
            />
            <Image
              src="/images/designs/speckled-silver-scene.jpg"
              alt="Vinyl deck surface on a backyard deck in full sun"
              width={1680}
              height={945}
              className="w-full h-auto"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
