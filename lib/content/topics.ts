import { loadAllDocuments } from "./load";
import { documentUrl } from "./urls";

export type TopicCluster = {
  tag: string;
  slug: string;
  items: { title: string; url: string; kind: string; summary: string }[];
};

export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function allTopics(): TopicCluster[] {
  const buckets = new Map<string, TopicCluster>();
  for (const doc of loadAllDocuments()) {
    for (const tag of doc.frontmatter.tags) {
      const slug = tagToSlug(tag);
      if (!slug) continue;
      const current = buckets.get(slug) ?? { tag, slug, items: [] };
      current.items.push({
        title: doc.frontmatter.title,
        url: documentUrl(doc.frontmatter),
        kind: doc.frontmatter.kind,
        summary: doc.frontmatter.summary,
      });
      buckets.set(slug, current);
    }
  }
  return [...buckets.values()].sort((a, b) => a.tag.localeCompare(b.tag));
}

export function topicBySlug(slug: string): TopicCluster | undefined {
  return allTopics().find((topic) => topic.slug === slug);
}
