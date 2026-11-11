import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";

const FOOTER = [
  { href: "/about", label: "About" },
  { href: "/contribute", label: "Contribute" },
  { href: "/changelog", label: "What's new" },
  { href: "/blog", label: "Blog" },
  { href: "/knowledge-graph", label: "Knowledge graph" },
  { href: "/study-with-me", label: "Study with me" },
  { href: "/cheatsheets", label: "Cheatsheets" },
  { href: "/feed.xml", label: "RSS" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-3">
          <p className="font-heading text-sm font-semibold">StackAtlas</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Mapped learning across DSA, system design, language ecosystems, cloud, and AI engineering — built to be
            found, linked, and finished.
          </p>
          <NewsletterForm compact />
        </div>
        <nav className="grid grid-cols-2 gap-2 text-sm" aria-label="Footer">
          {FOOTER.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
