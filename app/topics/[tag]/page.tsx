import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { allTopics, topicBySlug } from "@/lib/content/topics";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return allTopics().map((topic) => ({ tag: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const topic = topicBySlug(tag);
  if (!topic) return {};
  return pageMetadata({
    title: `${topic.tag} — topic cluster`,
    description: `Lessons, labs, and questions tagged ${topic.tag} on StackAtlas.`,
    path: `/topics/${tag}`,
    type: "website",
  });
}

export default async function TopicPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const topic = topicBySlug(tag);
  if (!topic) notFound();
  return (
    <div>
      <PageHeader title={topic.tag} description={`Everything tagged ${topic.tag}, ranked by how the content graph clusters it.`} />
      <ul className="flex flex-col gap-3">
        {topic.items.map((item) => (
          <li key={item.url}>
            <Link href={item.url} className="font-medium hover:underline">
              {item.title}
            </Link>
            <p className="text-sm text-muted-foreground">
              {item.kind} · {item.summary}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
