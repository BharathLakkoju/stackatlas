import Link from "next/link";
import { relatedContent } from "@/lib/content/related";
import { nextLessons } from "@/lib/content/graph";
import { getDocumentBySlug } from "@/lib/content/load";
import { documentUrl, lessonUrl } from "@/lib/content/urls";

export function RelatedLinks({ slug }: { slug: string }) {
  const related = relatedContent(slug, 6);
  if (!related.length) return null;
  return (
    <aside className="flex flex-col gap-3">
      <h2 className="font-heading text-sm font-medium">Related</h2>
      <ul className="flex flex-col gap-2 text-sm">
        {related.map((item) => {
          const doc = getDocumentBySlug(item.slug);
          if (!doc) return null;
          return (
            <li key={item.slug}>
              <Link href={documentUrl(doc.frontmatter)} className="hover:underline">
                {item.title}
              </Link>
              <span className="ml-2 text-xs text-muted-foreground">{item.kind}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export function NextLessonLinks({ slug }: { slug: string }) {
  const next = nextLessons(slug);
  if (!next.length) return null;
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">What to learn next</p>
      <ul className="mt-2 flex flex-col gap-2">
        {next.map((lesson) => (
          <li key={lesson.slug}>
            <Link href={lessonUrl(lesson)} className="font-medium hover:underline">
              {lesson.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PrerequisiteLinks({ slugs }: { slugs: string[] }) {
  if (!slugs.length) return null;
  return (
    <p className="text-sm text-muted-foreground">
      Prerequisites:{" "}
      {slugs.map((slug, index) => {
        const doc = getDocumentBySlug(slug);
        if (!doc) return slug;
        return (
          <span key={slug}>
            {index ? ", " : null}
            <Link href={documentUrl(doc.frontmatter)} className="text-foreground underline-offset-4 hover:underline">
              {doc.frontmatter.title}
            </Link>
          </span>
        );
      })}
    </p>
  );
}
