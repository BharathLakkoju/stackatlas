import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { DsaVisualizer } from "@/components/labs/dsa-visualizer";
import { ConsistentHashingLab } from "@/components/labs/consistent-hashing";
import { RagChunkingLab } from "@/components/labs/rag-chunking";
import { documentsByKind, getDocumentBySlug } from "@/lib/content/load";
import { learningResourceJsonLd } from "@/lib/jsonld";
import { renderMdx } from "@/lib/mdx";
import { pageMetadata } from "@/lib/seo";

const WIDGETS = {
  "dsa-visualizer": DsaVisualizer,
  "consistent-hashing": ConsistentHashingLab,
  "rag-chunking": RagChunkingLab,
};

export function generateStaticParams() {
  return documentsByKind("lab").map((doc) => ({ slug: doc.frontmatter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocumentBySlug(slug);
  if (!doc || doc.frontmatter.kind !== "lab") return {};
  return pageMetadata({ title: doc.frontmatter.title, description: doc.frontmatter.summary, path: `/labs/${slug}` });
}

export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocumentBySlug(slug);
  if (!doc || doc.frontmatter.kind !== "lab") notFound();
  const Widget = WIDGETS[doc.frontmatter.labId];
  const body = await renderMdx(doc.body);
  return (
    <div className="flex flex-col gap-8">
      <JsonLd data={learningResourceJsonLd(doc.frontmatter)} />
      <header>
        <h1 className="font-heading text-3xl font-semibold">{doc.frontmatter.title}</h1>
        <p className="mt-2 text-muted-foreground">{doc.frontmatter.summary}</p>
      </header>
      {Widget ? <Widget /> : null}
      <div className="prose-atlas">{body}</div>
    </div>
  );
}
