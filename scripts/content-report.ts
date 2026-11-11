import fs from "node:fs";
import path from "node:path";
import { documentsByKind, loadAllDocuments, loadRoadmaps } from "../lib/content/load";
import { TRACK_IDS, TRACKS } from "../lib/content/tracks";

const report = {
  generatedAt: new Date().toISOString(),
  totals: {
    documents: loadAllDocuments().length,
    lessons: documentsByKind("lesson").length,
    interviews: documentsByKind("interview").length,
    dailies: documentsByKind("daily").length,
    cheatsheets: documentsByKind("cheatsheet").length,
    labs: documentsByKind("lab").length,
    blogs: documentsByKind("blog").length,
    compares: documentsByKind("compare").length,
    roadmaps: loadRoadmaps().length,
  },
  tracks: TRACK_IDS.map((id) => ({
    id,
    title: TRACKS[id].title,
    lessons: documentsByKind("lesson").filter((d) => d.frontmatter.track === id).length,
    interviews: documentsByKind("interview").filter((d) => d.frontmatter.track === id).length,
    cheatsheets: documentsByKind("cheatsheet").filter((d) => d.frontmatter.track === id).length,
    minutes: documentsByKind("lesson")
      .filter((d) => d.frontmatter.track === id)
      .reduce((sum, d) => sum + d.frontmatter.estimatedMinutes, 0),
  })),
};

const dir = path.join(process.cwd(), ".cache");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "content-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
