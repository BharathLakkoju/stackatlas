import fs from "node:fs";
import path from "node:path";
import { allTrackRoots, buildGraph, detectCycles, reachableFrom, trackRoots } from "./graph";
import { documentsByKind, loadAllDocuments, loadRoadmaps, slugIndex } from "./load";
import { TRACK_IDS } from "./tracks";
import { documentUrl } from "./urls";

const INTERNAL_LINK = /\]\((\/[a-z0-9\-/_#]+)\)/gi;
const HREF_LINK = /href=["'](\/[a-z0-9\-/_#]+)["']/gi;

export type ValidationIssue = { level: "error" | "warning"; message: string };

export function validateContent(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const docs = loadAllDocuments(true);
  const bySlug = slugIndex();
  const seen = new Map<string, string>();

  for (const doc of docs) {
    const { slug } = doc.frontmatter;
    const existing = seen.get(slug);
    if (existing) {
      issues.push({
        level: "error",
        message: `Duplicate slug "${slug}" in ${path.relative(process.cwd(), doc.filePath)} and ${existing}`,
      });
    } else {
      seen.set(slug, path.relative(process.cwd(), doc.filePath));
    }
  }

  const graph = buildGraph();
  for (const lesson of documentsByKind("lesson")) {
    for (const prereq of lesson.frontmatter.prerequisites) {
      if (!graph.nodes.has(prereq)) {
        issues.push({
          level: "error",
          message: `Lesson ${lesson.frontmatter.slug} missing prerequisite "${prereq}"`,
        });
      }
    }
    for (const related of lesson.frontmatter.related) {
      if (!bySlug.has(related)) {
        issues.push({
          level: "error",
          message: `Lesson ${lesson.frontmatter.slug} related slug "${related}" does not exist`,
        });
      }
    }
    for (const compare of lesson.frontmatter.compareWith) {
      if (!bySlug.has(compare)) {
        issues.push({
          level: "error",
          message: `Lesson ${lesson.frontmatter.slug} compareWith "${compare}" does not exist`,
        });
      }
    }
  }

  const knownUrls = new Set(docs.map((doc) => documentUrl(doc.frontmatter)));
  knownUrls.add("/");
  knownUrls.add("/roadmaps");
  knownUrls.add("/labs");
  knownUrls.add("/cheatsheets");
  knownUrls.add("/interview");
  knownUrls.add("/daily");
  knownUrls.add("/blog");
  knownUrls.add("/tools");
  knownUrls.add("/knowledge-graph");
  knownUrls.add("/study-with-me");
  knownUrls.add("/about");
  knownUrls.add("/contribute");
  knownUrls.add("/changelog");
  knownUrls.add("/tools/big-o");
  knownUrls.add("/tools/capacity");
  knownUrls.add("/tools/llm-cost");
  knownUrls.add("/labs/dsa-visualizer");
  knownUrls.add("/labs/consistent-hashing");
  knownUrls.add("/labs/rag-chunking");
  for (const track of TRACK_IDS) {
    knownUrls.add(`/${track}`);
    knownUrls.add(`/interview/${track}`);
    knownUrls.add(`/cheatsheets/${track}`);
    knownUrls.add(`/feed/${track}.xml`);
  }
  knownUrls.add("/feed.xml");
  knownUrls.add("/daily/feed.xml");

  for (const doc of docs) {
    const matches = [...doc.body.matchAll(INTERNAL_LINK), ...doc.body.matchAll(HREF_LINK)];
    for (const match of matches) {
      const href = match[1].split("#")[0];
      if (!href) continue;
      if (!knownUrls.has(href) && !bySlug.has(href.split("/").filter(Boolean).at(-1) ?? "")) {
        if (!knownUrls.has(href)) {
          issues.push({
            level: "error",
            message: `Broken internal link ${href} in ${path.relative(process.cwd(), doc.filePath)}`,
          });
        }
      }
    }
  }

  const reachable = reachableFrom(allTrackRoots());
  for (const lesson of documentsByKind("lesson")) {
    if (!reachable.has(lesson.frontmatter.slug)) {
      issues.push({
        level: "error",
        message: `Orphan lesson "${lesson.frontmatter.slug}" is not reachable from a track root`,
      });
    }
  }

  for (const cycle of detectCycles()) {
    issues.push({ level: "error", message: `Prerequisite cycle: ${cycle.join(" -> ")}` });
  }

  for (const track of TRACK_IDS) {
    const lessons = documentsByKind("lesson").filter((d) => d.frontmatter.track === track);
    const cheats = documentsByKind("cheatsheet").filter((d) => d.frontmatter.track === track);
    const interviews = documentsByKind("interview").filter((d) => d.frontmatter.track === track);
    if (lessons.length < 6) {
      issues.push({ level: "error", message: `Track ${track} has ${lessons.length} lessons; need ≥ 6` });
    }
    if (cheats.length < 1) {
      issues.push({ level: "error", message: `Track ${track} is missing a cheatsheet` });
    }
    if (interviews.length < 10) {
      issues.push({
        level: "error",
        message: `Track ${track} has ${interviews.length} interview questions; need ≥ 10`,
      });
    }
    if (trackRoots(track).length === 0) {
      issues.push({ level: "error", message: `Track ${track} has no root lesson` });
    }
  }

  const dailies = documentsByKind("daily");
  if (dailies.length < 7) {
    issues.push({ level: "error", message: `Need ≥ 7 daily items; found ${dailies.length}` });
  }

  const roadmaps = loadRoadmaps(true);
  if (roadmaps.length < 3) {
    issues.push({ level: "error", message: `Need ≥ 3 roadmaps; found ${roadmaps.length}` });
  }
  for (const roadmap of roadmaps) {
    for (const node of roadmap.nodes) {
      if (node.lessonSlug && !bySlug.has(node.lessonSlug)) {
        issues.push({
          level: "error",
          message: `Roadmap ${roadmap.slug} node ${node.id} points at missing lesson ${node.lessonSlug}`,
        });
      }
    }
  }

  const labs = documentsByKind("lab");
  if (labs.length < 3) {
    issues.push({ level: "error", message: `Need ≥ 3 labs; found ${labs.length}` });
  }

  return issues;
}

export function assertValidContent(): void {
  const issues = validateContent();
  const errors = issues.filter((issue) => issue.level === "error");
  const dir = path.join(process.cwd(), ".cache");
  fs.mkdirSync(dir, { recursive: true });
  const graph = buildGraph();
  fs.writeFileSync(
    path.join(dir, "graph.json"),
    JSON.stringify(
      {
        nodes: [...graph.nodes.values()],
        outbound: Object.fromEntries(graph.outbound),
        inbound: Object.fromEntries(graph.inbound),
      },
      null,
      2,
    ),
  );
  fs.writeFileSync(path.join(dir, "validation.json"), JSON.stringify(issues, null, 2));
  if (errors.length) {
    throw new Error(errors.map((issue) => issue.message).join("\n"));
  }
}
