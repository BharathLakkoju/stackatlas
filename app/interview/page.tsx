import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { documentsByKind } from "@/lib/content/load";
import { TRACK_LIST } from "@/lib/content/tracks";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Interview question banks",
  description: "Model answers and follow-ups across DSA, system design, languages, cloud, and AI.",
  path: "/interview",
  type: "website",
});

export default function InterviewIndex() {
  return (
    <div>
      <PageHeader
        title="Interview banks"
        description="Questions you will actually get, with a model answer and the follow-ups interviewers use to see if you understood the tradeoff."
      />
      <ul className="flex flex-col gap-4">
        {TRACK_LIST.map((track) => {
          const count = documentsByKind("interview").filter((d) => d.frontmatter.track === track.id).length;
          return (
            <li key={track.id}>
              <Link href={`/interview/${track.id}`} className="font-medium hover:underline">
                {track.title}
              </Link>
              <span className="ml-2 text-sm text-muted-foreground">{count} questions</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
