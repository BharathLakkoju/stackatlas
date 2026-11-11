import { documentsByKind, getDocumentBySlug, lessonsForTrack } from "./load";
import type { LessonFrontmatter, LoadedDocument } from "./schema";
import { TRACK_IDS, type TrackId } from "./tracks";
import { lessonUrl } from "./urls";

export type GraphNode = {
  slug: string;
  title: string;
  track: TrackId;
  href: string;
  prerequisites: string[];
};

export type ContentGraph = {
  nodes: Map<string, GraphNode>;
  outbound: Map<string, string[]>;
  inbound: Map<string, string[]>;
};

export function buildGraph(): ContentGraph {
  const lessons = documentsByKind("lesson");
  const nodes = new Map<string, GraphNode>();
  const outbound = new Map<string, string[]>();
  const inbound = new Map<string, string[]>();

  for (const lesson of lessons) {
    const fm = lesson.frontmatter;
    nodes.set(fm.slug, {
      slug: fm.slug,
      title: fm.title,
      track: fm.track,
      href: lessonUrl(fm),
      prerequisites: fm.prerequisites,
    });
    outbound.set(fm.slug, []);
    inbound.set(fm.slug, []);
  }

  for (const lesson of lessons) {
    for (const prereq of lesson.frontmatter.prerequisites) {
      inbound.get(lesson.frontmatter.slug)?.push(prereq);
      outbound.get(prereq)?.push(lesson.frontmatter.slug);
    }
  }

  return { nodes, outbound, inbound };
}

export function nextLessons(slug: string, completed: Set<string> = new Set()): LessonFrontmatter[] {
  const graph = buildGraph();
  const outgoing = graph.outbound.get(slug) ?? [];
  const unlocked = outgoing
    .map((s) => getDocumentBySlug(s))
    .filter((doc): doc is LoadedDocument<LessonFrontmatter> => Boolean(doc && doc.frontmatter.kind === "lesson"))
    .map((doc) => doc.frontmatter)
    .filter((fm) => !completed.has(fm.slug));

  if (unlocked.length) return unlocked;

  const current = getDocumentBySlug(slug);
  if (!current || current.frontmatter.kind !== "lesson") return [];
  const lesson = current.frontmatter as LessonFrontmatter;
  const siblings = lessonsForTrack(lesson.track);
  const next = siblings.find(
    (doc) => doc.frontmatter.order > lesson.order && !completed.has(doc.frontmatter.slug),
  );
  return next ? [next.frontmatter] : [];
}

export function trackRoots(track: TrackId): string[] {
  return lessonsForTrack(track)
    .filter((doc) => doc.frontmatter.root || doc.frontmatter.prerequisites.length === 0)
    .map((doc) => doc.frontmatter.slug);
}

export function reachableFrom(roots: string[]): Set<string> {
  const graph = buildGraph();
  const seen = new Set<string>();
  const queue = [...roots];
  while (queue.length) {
    const slug = queue.shift();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    for (const child of graph.outbound.get(slug) ?? []) queue.push(child);
  }
  return seen;
}

export function detectCycles(): string[][] {
  const graph = buildGraph();
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const cycles: string[][] = [];

  function dfs(node: string, path: string[]) {
    if (visiting.has(node)) {
      const start = path.indexOf(node);
      cycles.push(path.slice(start).concat(node));
      return;
    }
    if (visited.has(node)) return;
    visiting.add(node);
    path.push(node);
    for (const next of graph.outbound.get(node) ?? []) dfs(next, path);
    path.pop();
    visiting.delete(node);
    visited.add(node);
  }

  for (const slug of graph.nodes.keys()) dfs(slug, []);
  return cycles;
}

export function allTrackRoots(): string[] {
  return TRACK_IDS.flatMap((track) => trackRoots(track));
}
