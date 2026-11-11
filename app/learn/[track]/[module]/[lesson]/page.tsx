import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CompleteButton } from "@/components/complete-button";
import { JsonLd } from "@/components/json-ld";
import { NextLessonLinks, PrerequisiteLinks, RelatedLinks } from "@/components/document-links";
import { documentsByKind, getDocumentBySlug } from "@/lib/content/load";
import { isTrackId } from "@/lib/content/tracks";
import { lessonUrl } from "@/lib/content/urls";
import { articleJsonLd, breadcrumbJsonLd, learningResourceJsonLd } from "@/lib/jsonld";
import { renderMdx } from "@/lib/mdx";
import { pageMetadata } from "@/lib/seo";
import type { LessonFrontmatter } from "@/lib/content/schema";

export function generateStaticParams() {
  return documentsByKind("lesson").map((doc) => ({
    track: doc.frontmatter.track,
    module: doc.frontmatter.module,
    lesson: doc.frontmatter.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string; module: string; lesson: string }>;
}) {
  const { lesson } = await params;
  const doc = getDocumentBySlug(lesson);
  if (!doc || doc.frontmatter.kind !== "lesson") return {};
  return pageMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.summary,
    path: lessonUrl(doc.frontmatter),
  });
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ track: string; module: string; lesson: string }>;
}) {
  const { track, module, lesson } = await params;
  const doc = getDocumentBySlug(lesson);
  if (!doc || doc.frontmatter.kind !== "lesson") notFound();
  const fm = doc.frontmatter as LessonFrontmatter;
  if (!isTrackId(track) || fm.track !== track || fm.module !== module) notFound();
  const body = await renderMdx(doc.body);

  return (
    <article className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <JsonLd
        data={[
          articleJsonLd(fm),
          learningResourceJsonLd(fm),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: fm.track, path: `/${fm.track}` },
            { name: fm.title, path: lessonUrl(fm) },
          ]),
        ]}
      />
      <div>
        <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
          {fm.track} · {fm.module.replace(/-/g, " ")}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">{fm.title}</h1>
        <p className="mt-3 text-muted-foreground">{fm.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{fm.difficulty}</Badge>
          <Badge variant="outline">{fm.estimatedMinutes} min</Badge>
          <CompleteButton slug={fm.slug} />
        </div>
        <PrerequisiteLinks slugs={fm.prerequisites} />
        <div className="prose-atlas mt-8">{body}</div>
        <div className="mt-10">
          <NextLessonLinks slug={fm.slug} />
        </div>
      </div>
      <RelatedLinks slug={fm.slug} />
    </article>
  );
}
