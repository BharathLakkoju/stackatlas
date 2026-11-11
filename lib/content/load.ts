import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { frontmatterSchema, roadmapSchema, type Frontmatter, type LoadedDocument, type Roadmap } from "./schema";
import type { TrackId } from "./tracks";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");

let cache: LoadedDocument[] | null = null;
let roadmapCache: Roadmap[] | null = null;

export function contentDir(): string {
  return CONTENT_DIR;
}

function listFiles(dir: string, match: (name: string) => boolean): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full, match));
    else if (entry.isFile() && match(entry.name)) out.push(full);
  }
  return out;
}

export function loadAllDocuments(force = false): LoadedDocument[] {
  if (cache && !force) return cache;
  const files = listFiles(CONTENT_DIR, (name) => name.endsWith(".mdx") || name.endsWith(".md"));
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
  const files = listFiles(path.join(ROOT, "content/roadmaps"), (name) => name.endsWith(".json"));
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
