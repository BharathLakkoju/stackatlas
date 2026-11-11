import type { MetadataRoute } from "next";
import { loadAllDocuments, loadRoadmaps } from "@/lib/content/load";
import { TRACK_IDS } from "@/lib/content/tracks";
import { allTopics } from "@/lib/content/topics";
import { documentUrl } from "@/lib/content/urls";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/roadmaps",
    "/labs",
    "/cheatsheets",
    "/interview",
    "/daily",
    "/blog",
    "/tools",
    "/tools/big-o",
    "/tools/capacity",
    "/tools/llm-cost",
    "/knowledge-graph",
    "/study-with-me",
    "/about",
    "/contribute",
    "/changelog",
    ...TRACK_IDS.map((track) => `/${track}`),
    ...TRACK_IDS.map((track) => `/interview/${track}`),
    ...loadRoadmaps().map((map) => `/roadmaps/${map.slug}`),
    ...allTopics().map((topic) => `/topics/${topic.slug}`),
  ];
  const docs = loadAllDocuments().map((doc) => documentUrl(doc.frontmatter));
  const urls = [...new Set([...staticPaths, ...docs])];
  return urls.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date("2026-11-01"),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
