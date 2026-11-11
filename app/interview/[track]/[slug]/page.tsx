import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { RelatedLinks } from "@/components/document-links";
import { documentsByKind, getDocumentBySlug } from "@/lib/content/load";
import { isTrackId } from "@/lib/content/tracks";
import { articleJsonLd, faqJsonLd } from "@/lib/jsonld";
import { renderMdx } from "@/lib/mdx";
import { pageMetadata } from "@/lib/seo";
import type { InterviewFrontmatter } from "@/lib/content/schema";

export function generateStaticParams() {
  return documentsByKind("interview").map((doc) => ({
    track: doc.frontmatter.track,
    slug: doc.frontmatter.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ track: string; slug: string }> }) {
  const { slug } = await params;
  const doc = getDocumentBySlug(slug);
  if (!doc || doc.frontmatter.kind !== "interview") return {};
  return pageMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.summary,
    path: `/interview/${doc.frontmatter.track}/${slug}`,
  });
}

export default async function InterviewQuestionPage({
  params,
}: {
  params: Promise<{ track: string; slug: string }>;
}) {
  const { track, slug } = await params;
  const doc = getDocumentBySlug(slug);
  if (!doc || doc.frontmatter.kind !== "interview" || !isTrackId(track) || doc.frontmatter.track !== track) {
    notFound();
  }
  const fm = doc.frontmatter as InterviewFrontmatter;
  const body = await renderMdx(doc.body);
  return (
    <article className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <JsonLd
        data={[
          articleJsonLd(fm),
          faqJsonLd([
            { q: fm.title, a: fm.summary },
            ...fm.followUps.map((q) => ({ q, a: "See the model answer on this page." })),
          ]),
        ]}
      />
      <div>
        <h1 className="font-heading text-3xl font-semibold">{fm.title}</h1>
        <p className="mt-2 text-muted-foreground">{fm.summary}</p>
        <div className="prose-atlas mt-8">{body}</div>
      </div>
      <RelatedLinks slug={fm.slug} />
    </article>
  );
}
