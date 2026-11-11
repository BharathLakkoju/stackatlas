import { documentsByKind } from "@/lib/content/load";
import { rssXml } from "@/lib/rss";

export function GET() {
  return new Response(rssXml("StackAtlas Daily", "/daily", documentsByKind("daily")), {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
