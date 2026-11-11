import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { documentsByKind } from "@/lib/content/load";
import { TRACK_IDS, TRACKS, isTrackId } from "@/lib/content/tracks";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return TRACK_IDS.map((track) => ({ track }));
}

export async function generateMetadata({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  if (!isTrackId(track)) return {};
  return pageMetadata({
    title: `${TRACKS[track].shortTitle} interview questions`,
    description: `Model answers and follow-ups for ${TRACKS[track].title}.`,
    path: `/interview/${track}`,
    type: "website",
  });
}

export default async function InterviewTrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  if (!isTrackId(track)) notFound();
  const questions = documentsByKind("interview").filter((d) => d.frontmatter.track === track);
  return (
    <div>
      <PageHeader title={`${TRACKS[track].shortTitle} interviews`} description={TRACKS[track].summary} />
      <ol className="flex flex-col gap-3">
        {questions.map((q) => (
          <li key={q.frontmatter.slug}>
            <Link href={`/interview/${track}/${q.frontmatter.slug}`} className="font-medium hover:underline">
              {q.frontmatter.title}
            </Link>
            <p className="text-sm text-muted-foreground">{q.frontmatter.summary}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
