import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { documentsByKind } from "@/lib/content/load";
import { TRACKS } from "@/lib/content/tracks";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cheatsheets",
  description: "One-page printable references for every StackAtlas track.",
  path: "/cheatsheets",
  type: "website",
});

export default function CheatsheetsPage() {
  const sheets = documentsByKind("cheatsheet");
  return (
    <div>
      <PageHeader
        title="Cheatsheets"
        description="Dense, printable references. Each sheet maps to the live lessons so you can jump from a bullet to the why."
      />
      <ul className="flex flex-col gap-3">
        {sheets.map((sheet) => (
          <li key={sheet.frontmatter.slug}>
            <Link href={`/cheatsheets/${sheet.frontmatter.track}`} className="font-medium hover:underline">
              {TRACKS[sheet.frontmatter.track].title}
            </Link>
            <p className="text-sm text-muted-foreground">{sheet.frontmatter.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
