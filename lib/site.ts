export const SITE = {
  name: "StackAtlas",
  tagline: "Mapped learning for working software engineers",
  description:
    "Pattern-first courses, roadmaps, labs, and interview drills across DSA, system design, JavaScript/TypeScript, Python, Java, cloud, and AI engineering.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://stackatlas.dev",
  locale: "en_US",
  twitter: "@stackatlas",
} as const;

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${normalized}`;
}
