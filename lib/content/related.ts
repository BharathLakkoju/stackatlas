import { buildGraph } from "./graph";
import { getDocumentBySlug, loadAllDocuments } from "./load";
import type { Frontmatter } from "./schema";

export type RankedRelated = {
  slug: string;
  title: string;
  kind: Frontmatter["kind"];
  score: number;
};

export function relatedContent(slug: string, limit = 6): RankedRelated[] {
  const current = getDocumentBySlug(slug);
  if (!current) return [];
  const graph = buildGraph();
  const scores = new Map<string, number>();

  const bump = (target: string, amount: number) => {
    if (target === slug) return;
    scores.set(target, (scores.get(target) ?? 0) + amount);
  };

  for (const rel of current.frontmatter.related) bump(rel, 5);
  for (const neighbor of graph.outbound.get(slug) ?? []) bump(neighbor, 4);
  for (const neighbor of graph.inbound.get(slug) ?? []) bump(neighbor, 4);

  const currentTags = new Set(current.frontmatter.tags);
  const currentTrack = "track" in current.frontmatter ? current.frontmatter.track : undefined;
  const currentModule = current.frontmatter.kind === "lesson" ? current.frontmatter.module : undefined;

  for (const doc of loadAllDocuments()) {
    if (doc.frontmatter.slug === slug) continue;
    const tagOverlap = doc.frontmatter.tags.filter((tag) => currentTags.has(tag)).length;
    if (tagOverlap) bump(doc.frontmatter.slug, tagOverlap);
    if (currentTrack && "track" in doc.frontmatter && doc.frontmatter.track === currentTrack) {
      bump(doc.frontmatter.slug, 1);
    }
    if (currentModule && doc.frontmatter.kind === "lesson" && doc.frontmatter.module === currentModule) {
      bump(doc.frontmatter.slug, 2);
    }
  }

  return [...scores.entries()]
    .map(([relatedSlug, score]) => {
      const doc = getDocumentBySlug(relatedSlug);
      if (!doc) return null;
      return {
        slug: relatedSlug,
        title: doc.frontmatter.title,
        kind: doc.frontmatter.kind,
        score,
      };
    })
    .filter((item): item is RankedRelated => Boolean(item))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
