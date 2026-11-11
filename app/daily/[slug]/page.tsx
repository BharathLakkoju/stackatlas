import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { RelatedLinks } from "@/components/document-links";
import { documentsByKind, getDocumentBySlug } from "@/lib/content/load";
import { articleJsonLd } from "@/lib/jsonld";
import { renderMdx } from "@/lib/mdx";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return documentsByKind("daily").map((doc) => ({ slug: doc.frontmatter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocumentBySlug(slug);
  if (!doc || doc.frontmatter.kind !== "daily") return {};
  return pageMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.summary,
    path: `/daily/${slug}`,
  });
}

export default async function DailyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocumentBySlug(slug);
  if (!doc || doc.frontmatter.kind !== "daily") notFound();
  const body = await renderMdx(doc.body);
  return (
    <article className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <JsonLd data={articleJsonLd(doc.frontmatter)} />
      <div>
        <p className="text-xs text-muted-foreground">{doc.frontmatter.publishedAt}</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">{doc.frontmatter.title}</h1>
        <div className="prose-atlas mt-6">{body}</div>
      </div>
      <RelatedLinks slug={slug} />
    </article>
  );
}
