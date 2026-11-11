export const TRACK_IDS = [
  "dsa",
  "system-design",
  "js-ts",
  "python",
  "java",
  "cloud",
  "ai",
] as const;

export type TrackId = (typeof TRACK_IDS)[number];

export type TrackMeta = {
  id: TrackId;
  title: string;
  shortTitle: string;
  href: string;
  summary: string;
  color: string;
  startHere: string;
};

export const TRACKS: Record<TrackId, TrackMeta> = {
  dsa: {
    id: "dsa",
    title: "Data Structures & Algorithms",
    shortTitle: "DSA",
    href: "/dsa",
    summary:
      "Pattern-first problem solving: hashing, windows, graphs, heaps, and dynamic programming with interview-ready drills.",
    color: "chart-1",
    startHere: "big-o-complexity",
  },
  "system-design": {
    id: "system-design",
    title: "System Design",
    shortTitle: "System Design",
    href: "/system-design",
    summary:
      "Scalability, consistency, caching, queues, and case studies from URL shorteners to feeds and payments.",
    color: "chart-2",
    startHere: "scalability-fundamentals",
  },
  "js-ts": {
    id: "js-ts",
    title: "JavaScript & TypeScript",
    shortTitle: "JS/TS",
    href: "/js-ts",
    summary:
      "Runtime internals, TypeScript, Node, React, and Next.js — the stack most product teams actually ship.",
    color: "chart-3",
    startHere: "event-loop",
  },
  python: {
    id: "python",
    title: "Python & FastAPI",
    shortTitle: "Python",
    href: "/python",
    summary:
      "CPython internals, typing, FastAPI dependency injection, Pydantic v2, and async SQLAlchemy.",
    color: "chart-4",
    startHere: "gil",
  },
  java: {
    id: "java",
    title: "Java & Spring Boot",
    shortTitle: "Java",
    href: "/java",
    summary:
      "Collections, concurrency, the JVM, then Spring IoC, JPA, and JWT security used in production services.",
    color: "chart-5",
    startHere: "collections",
  },
  cloud: {
    id: "cloud",
    title: "Cloud & DevOps",
    shortTitle: "Cloud",
    href: "/cloud",
    summary:
      "AWS primitives, Docker image layers, VPC networking, and CI/CD with cost and blast-radius in mind.",
    color: "chart-1",
    startHere: "iam",
  },
  ai: {
    id: "ai",
    title: "AI Engineering",
    shortTitle: "AI",
    href: "/ai",
    summary:
      "LLMs, embeddings, RAG, LangGraph agents, evals, and the production constraints that actually matter.",
    color: "chart-2",
    startHere: "llm-fundamentals",
  },
};

export const TRACK_LIST = TRACK_IDS.map((id) => TRACKS[id]);

export function isTrackId(value: string): value is TrackId {
  return (TRACK_IDS as readonly string[]).includes(value);
}
