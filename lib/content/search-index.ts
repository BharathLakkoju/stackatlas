import fs from "node:fs";
import path from "node:path";
import { loadAllDocuments } from "./load";
import { documentUrl } from "./urls";

export type SearchDoc = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  track: string;
  kind: string;
  headings: string;
  url: string;
};

export function buildSearchDocuments(): SearchDoc[] {
  return loadAllDocuments().map((doc) => {
    const headings = [...doc.body.matchAll(/^#{1,3}\s+(.+)$/gm)].map((m) => m[1]).join(" ");
    const track = "track" in doc.frontmatter && doc.frontmatter.track ? doc.frontmatter.track : "meta";
    return {
      id: doc.frontmatter.slug,
      title: doc.frontmatter.title,
      summary: doc.frontmatter.summary,
      tags: doc.frontmatter.tags,
      track,
      kind: doc.frontmatter.kind,
      headings,
      url: documentUrl(doc.frontmatter),
    };
  });
}

export function writeSearchIndex(): string {
  const docs = buildSearchDocuments();
  const out = path.join(process.cwd(), "public", "search-index.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(docs));
  return out;
}
