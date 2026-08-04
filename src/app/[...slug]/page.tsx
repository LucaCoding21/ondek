import Link from "next/link";

function titleFromSlug(slug: string[]) {
  const last = slug[slug.length - 1] ?? "";
  return last
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function WorkInProgressPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const title = titleFromSlug(slug);

  return (
    <div className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 lg:py-44 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold">{title}</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-foreground/60 leading-relaxed">
          This page is part of the site refresh and is being built out. Check
          back soon.
        </p>
        <Link
          href="/"
          className="mt-9 inline-block px-7 py-3.5 font-bold btn-wipe "
        >
          Back to the homepage
        </Link>
      </div>
    </div>
  );
}
