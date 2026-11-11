import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { JsonLd } from "@/components/json-ld";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { documentsByKind, lessonsForTrack } from "@/lib/content/load";
import { TRACK_IDS, TRACKS, isTrackId } from "@/lib/content/tracks";
import { documentUrl, lessonUrl } from "@/lib/content/urls";
import { courseJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return TRACK_IDS.map((track) => ({ track }));
}

export async function generateMetadata({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  if (!isTrackId(track)) return {};
  const meta = TRACKS[track];
  return pageMetadata({ title: meta.title, description: meta.summary, path: meta.href, type: "website" });
}

export default async function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  if (!isTrackId(track)) notFound();
  const meta = TRACKS[track];
  const lessons = lessonsForTrack(track);
  const labs = documentsByKind("lab").filter((doc) => doc.frontmatter.track === track);
  const articles = [
    ...documentsByKind("blog").filter((doc) => doc.frontmatter.track === track),
    ...documentsByKind("daily").filter((doc) => doc.frontmatter.track === track),
  ];
  const modules = [...new Set(lessons.map((l) => l.frontmatter.module))];

  return (
    <div className="flex flex-col gap-10">
      <JsonLd
        data={[
          courseJsonLd(
            meta,
            lessons.map((l) => l.frontmatter.title),
          ),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: meta.title, path: meta.href },
          ]),
        ]}
      />
      <PageHeader eyebrow="Track" title={meta.title} description={meta.summary} />
      <p className="text-sm">
        <Link href={`/cheatsheets/${track}`} className="underline-offset-4 hover:underline">
          Cheatsheet
        </Link>
        {" · "}
        <Link href={`/interview/${track}`} className="underline-offset-4 hover:underline">
          Interview bank
        </Link>
        {" · "}
        <Link href="/roadmaps" className="underline-offset-4 hover:underline">
          Role roadmaps
        </Link>
      </p>
      {modules.map((moduleName) => (
        <section key={moduleName} className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-medium capitalize">{moduleName.replace(/-/g, " ")}</h2>
          <ol className="flex flex-col gap-2">
            {lessons
              .filter((l) => l.frontmatter.module === moduleName)
              .map((lesson) => (
                <li key={lesson.frontmatter.slug}>
                  <Link href={lessonUrl(lesson.frontmatter)} className="font-medium hover:underline">
                    {lesson.frontmatter.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">{lesson.frontmatter.summary}</p>
                </li>
              ))}
          </ol>
        </section>
      ))}
      {labs.length ? (
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-medium">Labs</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {labs.map((lab) => (
              <Card key={lab.frontmatter.slug}>
                <CardHeader>
                  <CardTitle>
                    <Link href={documentUrl(lab.frontmatter)}>{lab.frontmatter.title}</Link>
                  </CardTitle>
                  <CardDescription>{lab.frontmatter.summary}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
      {articles.length ? (
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-medium">Popular writing</h2>
          <ul className="flex flex-col gap-2">
            {articles.map((doc) => (
              <li key={doc.frontmatter.slug}>
                <Link href={documentUrl(doc.frontmatter)} className="hover:underline">
                  {doc.frontmatter.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
