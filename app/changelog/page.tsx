import { getDocumentBySlug } from "@/lib/content/load";
import { renderMdx } from "@/lib/mdx";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "What's new",
  description: "Public changelog for StackAtlas lessons, labs, and tooling.",
  path: "/changelog",
  type: "website",
});

export default async function ChangelogPage() {
  const doc = getDocumentBySlug("changelog");
  const body = doc ? await renderMdx(doc.body) : <p>No changelog yet.</p>;
  return (
    <article className="prose-atlas">
      <h1 className="font-heading text-3xl font-semibold">What is new</h1>
      {body}
    </article>
  );
}
