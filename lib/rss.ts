import { SITE, absoluteUrl } from "./site";
import type { LoadedDocument } from "./content/schema";
import { documentUrl } from "./content/urls";

export function rssXml(title: string, path: string, items: LoadedDocument[]) {
  const channelLink = absoluteUrl(path);
  const entries = items
    .slice()
    .sort((a, b) => {
      const da = "publishedAt" in a.frontmatter ? a.frontmatter.publishedAt : a.frontmatter.lastReviewed;
      const db = "publishedAt" in b.frontmatter ? b.frontmatter.publishedAt : b.frontmatter.lastReviewed;
      return db.localeCompare(da);
    })
    .map((item) => {
      const url = absoluteUrl(documentUrl(item.frontmatter));
      return `<item><title><![CDATA[${item.frontmatter.title}]]></title><link>${url}</link><guid>${url}</guid><description><![CDATA[${item.frontmatter.summary}]]></description></item>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${title}</title><link>${channelLink}</link><description>${SITE.description}</description>${entries}</channel></rss>`;
}
