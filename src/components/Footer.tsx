import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS, CTA_LINKS } from "@/lib/nav";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
          <div className="col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/images/ondek-logo-white.svg"
                alt="OnDek"
                width={214}
                height={100}
                className="h-14 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-xs">
              Premium waterproof vinyl decking, manufactured for decks that
              last. Trusted by dealers and installers across North America.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href={CTA_LINKS.quote.href}
                className="px-4 py-2.5 text-sm font-bold bg-cta text-foreground hover:brightness-95 transition-[filter]"
              >
                {CTA_LINKS.quote.label}
              </Link>
              <Link
                href={CTA_LINKS.designKit.href}
                className="px-4 py-2.5 text-sm font-bold border border-white/25 hover:border-white/60 transition-colors"
              >
                {CTA_LINKS.designKit.label}
              </Link>
            </div>
          </div>

          {NAV_ITEMS.filter((i) => i.children).map((item) => (
            <div key={item.label}>
              <div className="text-xs font-bold uppercase tracking-widest text-white/40">
                {item.label}
              </div>
              <ul className="mt-4 space-y-2.5">
                {item.children!.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} OnDek Vinyl Decking. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/become-a-dealer" className="hover:text-white/70 transition-colors">
              Become a dealer
            </Link>
            <Link href="/company/contact" className="hover:text-white/70 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
