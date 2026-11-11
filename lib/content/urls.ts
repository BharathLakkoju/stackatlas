import type { Frontmatter, LessonFrontmatter } from "./schema";
import type { TrackId } from "./tracks";

export function documentUrl(doc: Frontmatter): string {
  switch (doc.kind) {
    case "lesson":
      return lessonUrl(doc);
    case "cheatsheet":
      return `/cheatsheets/${doc.track}`;
    case "interview":
      return `/interview/${doc.track}/${doc.slug}`;
    case "daily":
      return `/daily/${doc.slug}`;
    case "blog":
      return `/blog/${doc.slug}`;
    case "lab":
      return `/labs/${doc.slug}`;
    case "changelog":
      return "/changelog";
    case "compare":
      return `/compare/${doc.slug}`;
  }
}

export function lessonUrl(lesson: Pick<LessonFrontmatter, "track" | "module" | "slug">): string {
  return `/learn/${lesson.track}/${lesson.module}/${lesson.slug}`;
}

export function trackUrl(track: TrackId): string {
  return `/${track}`;
}
