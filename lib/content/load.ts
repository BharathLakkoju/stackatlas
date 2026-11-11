import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { globSync } from "glob";
import { frontmatterSchema, roadmapSchema, type Frontmatter, type LoadedDocument, type Roadmap } from "./schema";
import type { TrackId } from "./tracks";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");

let cache: LoadedDocument[] | null = null;
let roadmapCache: Roadmap[] | null = null;

export function contentDir(): string {
  return CONTENT_DIR;
}

export function loadAllDocuments(force = false): LoadedDocument[] {
  if (cache && !force) return cache;
  const files = globSync("**/*.{mdx,md}", { cwd: CONTENT_DIR, nodir: true, absolute: true });
  const docs: LoadedDocument[] = [];
  const errors: string[] = [];

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = matter(raw);
    const result = frontmatterSchema.safeParse(parsed.data);
    if (!result.success) {
      errors.push(`${path.relative(ROOT, filePath)}: ${result.error.message}`);
      continue;
    }
    docs.push({
      frontmatter: result.data,
      body: parsed.content,
      filePath,
    });
  }

  if (errors.length) {
    throw new Error(`Invalid frontmatter:\n${errors.join("\n")}`);
  }

  cache = docs;
  return docs;
}

export function loadRoadmaps(force = false): Roadmap[] {
  if (roadmapCache && !force) return roadmapCache;
  const files = globSync("content/roadmaps/*.json", { cwd: ROOT, nodir: true, absolute: true });
  const maps: Roadmap[] = [];
  const errors: string[] = [];
  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf8");
    const result = roadmapSchema.safeParse(JSON.parse(raw));
    if (!result.success) {
      errors.push(`${path.relative(ROOT, filePath)}: ${result.error.message}`);
      continue;
    }
    maps.push(result.data);
  }
  if (errors.length) {
    throw new Error(`Invalid roadmaps:\n${errors.join("\n")}`);
  }
  roadmapCache = maps;
  return maps;
}

export function documentsByKind<K extends Frontmatter["kind"]>(kind: K): LoadedDocument<Extract<Frontmatter, { kind: K }>>[] {
  return loadAllDocuments().filter(
    (doc): doc is LoadedDocument<Extract<Frontmatter, { kind: K }>> => doc.frontmatter.kind === kind,
  );
}

export function getDocumentBySlug(slug: string): LoadedDocument | undefined {
  return loadAllDocuments().find((doc) => doc.frontmatter.slug === slug);
}

export function lessonsForTrack(track: TrackId) {
  return documentsByKind("lesson")
    .filter((doc) => doc.frontmatter.track === track)
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}

export function slugIndex(): Map<string, LoadedDocument> {
  const map = new Map<string, LoadedDocument>();
  for (const doc of loadAllDocuments()) {
    map.set(doc.frontmatter.slug, doc);
  }
  return map;
}
