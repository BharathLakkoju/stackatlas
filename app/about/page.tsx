import { PageHeader } from "@/components/page-header";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About StackAtlas",
  description: "Why this hub exists and how the content graph is maintained.",
  path: "/about",
  type: "website",
});

export default function AboutPage() {
  return (
    <div className="prose-atlas">
      <PageHeader
        title="About"
        description="StackAtlas is a public map of the skills working software engineers are hired for — and the ones they keep using after the offer."
      />
      <p>
        Most learning sites sell a single stack or a single interview format. Jobs do not work that way. You will debug a
        sliding-window bug in the morning, argue about cache invalidation at noon, and ship a RAG path that must not
        hallucinate by Friday.
      </p>
      <p>
        Every lesson is MDX with a typed frontmatter schema. Prerequisites are real slugs. The build fails if a link is
        broken, a slug is duplicated, or a page is unreachable from a track root. That is the product: a graph you can
        trust.
      </p>
      <p>
        Progress is stored in your browser first. Accounts can come later; they must never be required to read.
      </p>
    </div>
  );
}
