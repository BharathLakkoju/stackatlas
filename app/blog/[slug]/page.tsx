import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { documentsByKind, getDocumentBySlug } from "@/lib/content/load";
import { articleJsonLd } from "@/lib/jsonld";
import { renderMdx } from "@/lib/mdx";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return documentsByKind("blog").map((doc) => ({ slug: doc.frontmatter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocumentBySlug(slug);
  if (!doc || doc.frontmatter.kind !== "blog") return {};
  return pageMetadata({ title: doc.frontmatter.title, description: doc.frontmatter.summary, path: `/blog/${slug}` });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocumentBySlug(slug);
  if (!doc || doc.frontmatter.kind !== "blog") notFound();
  const body = await renderMdx(doc.body);
  return (
    <article className="prose-atlas">
      <JsonLd data={articleJsonLd(doc.frontmatter)} />
      <h1 className="font-heading text-3xl font-semibold">{doc.frontmatter.title}</h1>
      <p className="text-muted-foreground">{doc.frontmatter.summary}</p>
      {body}
    </article>
  );
}
