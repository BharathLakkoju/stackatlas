import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { documentsByKind } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog",
  description: "Deep-dives on how StackAtlas maps skills and how production systems actually fail.",
  path: "/blog",
  type: "website",
});

export default function BlogIndex() {
  const posts = documentsByKind("blog");
  return (
    <div>
      <PageHeader title="Blog" description="Longer pieces that do not fit a lesson: editorial, research, and production postmortems of ideas." />
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.frontmatter.slug}>
            <Link href={`/blog/${post.frontmatter.slug}`} className="font-medium hover:underline">
              {post.frontmatter.title}
            </Link>
            <p className="text-sm text-muted-foreground">{post.frontmatter.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
