import { PageHeader } from "@/components/page-header";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contribute",
  description: "How to add a lesson, lab, or interview question to StackAtlas.",
  path: "/contribute",
  type: "website",
});

export default function ContributePage() {
  return (
    <div className="prose-atlas">
      <PageHeader
        title="Contribute"
        description="New pages must pass the same gates as the seed content: schema, links, snippets, and a real explanation."
      />
      <ol>
        <li>Add an MDX file under <code>content/</code> with the required frontmatter.</li>
        <li>Point <code>prerequisites</code> and <code>related</code> at existing slugs.</li>
        <li>Run <code>pnpm content:check</code> and <code>pnpm content:snippets</code>.</li>
        <li>Keep code fences complete and parseable. No ellipses.</li>
        <li>Explain why before how. One mental model beats three analogies.</li>
      </ol>
      <p>
        Full authoring notes live in the repository README. Open a pull request with a lesson that you would defend in an
        interview.
      </p>
    </div>
  );
}
