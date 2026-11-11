import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { documentsByKind } from "@/lib/content/load";
import { TRACK_IDS, TRACKS, isTrackId } from "@/lib/content/tracks";
import { articleJsonLd, learningResourceJsonLd } from "@/lib/jsonld";
import { renderMdx } from "@/lib/mdx";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return TRACK_IDS.map((track) => ({ track }));
}

export async function generateMetadata({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  if (!isTrackId(track)) return {};
  const sheet = documentsByKind("cheatsheet").find((d) => d.frontmatter.track === track);
  if (!sheet) return {};
  return pageMetadata({
    title: `${TRACKS[track].shortTitle} cheatsheet`,
    description: sheet.frontmatter.summary,
    path: `/cheatsheets/${track}`,
  });
}

export default async function CheatsheetPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  if (!isTrackId(track)) notFound();
  const sheet = documentsByKind("cheatsheet").find((d) => d.frontmatter.track === track);
  if (!sheet) notFound();
  const body = await renderMdx(sheet.body);
  return (
    <article className="prose-atlas print:max-w-none">
      <JsonLd data={[articleJsonLd(sheet.frontmatter), learningResourceJsonLd(sheet.frontmatter)]} />
      <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase print:hidden">Printable cheatsheet</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold">{sheet.frontmatter.title}</h1>
      <p className="text-muted-foreground">{sheet.frontmatter.summary}</p>
      {body}
    </article>
  );
}
