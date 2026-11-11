import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { documentsByKind } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Daily explainers",
  description: "One concept per day, rotating across all seven StackAtlas tracks.",
  path: "/daily",
  type: "website",
});

export default function DailyIndex() {
  const items = documentsByKind("daily").sort((a, b) =>
    b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
  );
  return (
    <div>
      <PageHeader title="Daily" description="A single concept, explained tightly. Subscribe via the daily RSS feed." />
      <ol className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.frontmatter.slug}>
            <p className="text-xs text-muted-foreground">{item.frontmatter.publishedAt}</p>
            <Link href={`/daily/${item.frontmatter.slug}`} className="font-medium hover:underline">
              {item.frontmatter.title}
            </Link>
            <p className="text-sm text-muted-foreground">{item.frontmatter.summary}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
