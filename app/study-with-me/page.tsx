import { PageHeader } from "@/components/page-header";
import { StudyTimer } from "@/components/study-timer";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Study with me",
  description: "A 25-minute focus timer with a per-topic log stored on this device.",
  path: "/study-with-me",
  type: "website",
});

export default function StudyPage() {
  return (
    <div>
      <PageHeader
        title="Study with me"
        description="Pick a lesson slug, run a 25-minute block, and keep a log in localStorage. No account required."
      />
      <StudyTimer />
    </div>
  );
}
