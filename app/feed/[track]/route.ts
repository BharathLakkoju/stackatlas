import { notFound } from "next/navigation";
import { documentsByKind } from "@/lib/content/load";
import { TRACK_IDS, TRACKS, isTrackId } from "@/lib/content/tracks";
import { rssXml } from "@/lib/rss";

export function generateStaticParams() {
  return TRACK_IDS.map((track) => ({ track: `${track}.xml` }));
}

export function GET(_req: Request, { params }: { params: Promise<{ track: string }> }) {
  return params.then(({ track: raw }) => {
    const track = raw.replace(/\.xml$/, "");
    if (!isTrackId(track)) notFound();
    const items = [
      ...documentsByKind("lesson").filter((d) => d.frontmatter.track === track),
      ...documentsByKind("daily").filter((d) => d.frontmatter.track === track),
    ];
    return new Response(rssXml(`${TRACKS[track].title} · StackAtlas`, `/${track}`, items), {
      headers: { "content-type": "application/rss+xml; charset=utf-8" },
    });
  });
}
