import { documentsByKind } from "@/lib/content/load";
import { rssXml } from "@/lib/rss";

export function GET() {
  const items = [...documentsByKind("lesson"), ...documentsByKind("blog"), ...documentsByKind("daily")];
  return new Response(rssXml("StackAtlas", "/", items), {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
