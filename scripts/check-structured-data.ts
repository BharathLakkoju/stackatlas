import { articleJsonLd, breadcrumbJsonLd, courseJsonLd, faqJsonLd, learningResourceJsonLd } from "../lib/jsonld";
import { TRACKS } from "../lib/content/tracks";
import type { Frontmatter } from "../lib/content/schema";

const sample: Frontmatter = {
  title: "Sample lesson",
  slug: "sample-lesson",
  kind: "lesson",
  summary: "A sample document used to validate JSON-LD helper output at build time.",
  tags: ["sample"],
  estimatedMinutes: 5,
  lastReviewed: "2026-11-01",
  related: [],
  track: "dsa",
  module: "fundamentals",
  order: 1,
  difficulty: "beginner",
  prerequisites: [],
  root: true,
  compareWith: [],
};

const payloads = [
  articleJsonLd(sample),
  learningResourceJsonLd(sample),
  breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "DSA", path: "/dsa" },
  ]),
  courseJsonLd(TRACKS.dsa, ["Big-O"]),
  faqJsonLd([{ q: "What is StackAtlas?", a: "A mapped learning hub." }]),
];

const required = ["Article", "LearningResource", "BreadcrumbList", "Course", "FAQPage"];
const types = payloads.map((item) => item["@type"]);
for (const type of required) {
  if (!types.includes(type)) {
    throw new Error(`Missing JSON-LD type ${type}`);
  }
}
console.log("Structured data helpers emit", types.join(", "));
