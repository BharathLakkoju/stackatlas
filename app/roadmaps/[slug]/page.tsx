import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { RoadmapView } from "@/components/roadmap-view";
import { getDocumentBySlug, loadRoadmaps } from "@/lib/content/load";
import { documentUrl } from "@/lib/content/urls";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return loadRoadmaps().map((map) => ({ slug: map.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const map = loadRoadmaps().find((item) => item.slug === slug);
  if (!map) return {};
  return pageMetadata({ title: map.title, description: map.summary, path: `/roadmaps/${slug}` });
}

export default async function RoadmapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const map = loadRoadmaps().find((item) => item.slug === slug);
  if (!map) notFound();
  const nodes = map.nodes.map((node) => {
    const doc = node.lessonSlug ? getDocumentBySlug(node.lessonSlug) : undefined;
    return {
      id: node.id,
      label: node.label,
      description: node.description,
      slug: node.lessonSlug,
      href: doc ? documentUrl(doc.frontmatter) : undefined,
    };
  });
  return (
    <div>
      <PageHeader eyebrow={map.role} title={map.title} description={map.summary} />
      <RoadmapView nodes={nodes} />
    </div>
  );
}
