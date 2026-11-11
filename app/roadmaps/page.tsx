import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadRoadmaps } from "@/lib/content/load";
import { TRACK_LIST } from "@/lib/content/tracks";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Roadmaps",
  description: "Role roadmaps and per-track sequences generated from the prerequisite graph.",
  path: "/roadmaps",
  type: "website",
});

export default function RoadmapsPage() {
  const roadmaps = loadRoadmaps();
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Roadmaps"
        description="Check off lessons in the browser. Progress never leaves this device unless you later add an account."
      />
      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-medium">By role</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {roadmaps.map((map) => (
            <Card key={map.slug}>
              <CardHeader>
                <CardTitle>
                  <Link href={`/roadmaps/${map.slug}`}>{map.title}</Link>
                </CardTitle>
                <CardDescription>
                  {map.summary} · ~{map.estimatedWeeks} weeks
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-medium">By track</h2>
        <ul className="flex flex-col gap-2">
          {TRACK_LIST.map((track) => (
            <li key={track.id}>
              <Link href={track.href} className="hover:underline">
                {track.title} course outline
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
