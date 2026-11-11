import { SITE, absoluteUrl } from "./site";
import type { Frontmatter } from "./content/schema";
import { documentUrl } from "./content/urls";
import type { TrackMeta } from "./content/tracks";

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(doc: Frontmatter) {
  const url = absoluteUrl(documentUrl(doc));
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: doc.title,
    description: doc.summary,
    dateModified: doc.lastReviewed,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: url,
    url,
  };
}

export function learningResourceJsonLd(doc: Frontmatter) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: doc.title,
    description: doc.summary,
    educationalLevel: "difficulty" in doc ? doc.difficulty : undefined,
    learningResourceType: doc.kind,
    timeRequired: `PT${doc.estimatedMinutes}M`,
    url: absoluteUrl(documentUrl(doc)),
  };
}

export function courseJsonLd(track: TrackMeta, lessonNames: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${track.title} course`,
    description: track.summary,
    provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      url: absoluteUrl(track.href),
    },
    syllabusSections: lessonNames.map((name) => ({
      "@type": "Syllabus",
      name,
    })),
  };
}

export function faqJsonLd(pairs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map((pair) => ({
      "@type": "Question",
      name: pair.q,
      acceptedAnswer: { "@type": "Answer", text: pair.a },
    })),
  };
}
