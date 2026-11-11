import { PageHeader } from "@/components/page-header";
import { KnowledgeGraphView } from "@/components/knowledge-graph-view";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Knowledge graph",
  description: "Prerequisite edges across DSA, system design, languages, cloud, and AI.",
  path: "/knowledge-graph",
  type: "website",
});

export default function KnowledgeGraphPage() {
  return (
    <div>
      <PageHeader
        title="Knowledge graph"
        description="Each arrow is a prerequisite declared in lesson frontmatter. The same graph drives roadmaps and “what to learn next.”"
      />
      <KnowledgeGraphView />
    </div>
  );
}
