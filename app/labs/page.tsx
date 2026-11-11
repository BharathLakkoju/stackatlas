import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { documentsByKind } from "@/lib/content/load";
import { documentUrl } from "@/lib/content/urls";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Interactive labs",
  description: "Touch sorting, consistent hashing, and RAG chunking in the browser.",
  path: "/labs",
  type: "website",
});

export default function LabsPage() {
  const labs = documentsByKind("lab");
  return (
    <div>
      <PageHeader
        title="Labs"
        description="Small systems you can poke. No accounts. Keyboard accessible. Built to make the mental model click."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {labs.map((lab) => (
          <Card key={lab.frontmatter.slug}>
            <CardHeader>
              <CardTitle>
                <Link href={documentUrl(lab.frontmatter)}>{lab.frontmatter.title}</Link>
              </CardTitle>
              <CardDescription>{lab.frontmatter.summary}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
