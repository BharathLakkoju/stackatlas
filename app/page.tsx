import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { JsonLd } from "@/components/json-ld";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { documentsByKind, lessonsForTrack } from "@/lib/content/load";
import { TRACK_LIST, TRACKS } from "@/lib/content/tracks";
import { lessonUrl } from "@/lib/content/urls";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${SITE.name}: mapped engineering skills`,
  description: SITE.description,
  path: "/",
  type: "website",
});

const PATHS = [
  {
    title: "Interview in 8 weeks",
    href: "/roadmaps/backend-engineer",
    detail: "DSA patterns, then system design case studies, with daily drills.",
  },
  {
    title: "First backend job",
    href: "/python",
    detail: "Python internals, FastAPI, and the AWS pieces you actually touch.",
  },
  {
    title: "Ship an AI feature",
    href: "/roadmaps/ai-engineer",
    detail: "Embeddings, RAG, agents, then evals so you can defend the design.",
  },
];

export default async function HomePage() {
  const dailies = documentsByKind("daily").sort((a, b) =>
    b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
  );
  const today = dailies[0];

  return (
    <div className="flex flex-col gap-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: SITE.url,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE.url}/topics/{query}`,
            "query-input": "required name=query",
          },
        }}
      />
      <PageHeader
        eyebrow="Public developer learning hub"
        title="Everything a working engineer actually needs. Mapped."
        description="Seven tracks covering interviews and the job: DSA, system design, JavaScript/TypeScript, Python, Java, cloud, and AI engineering. Courses, roadmaps, labs, and daily explainers with a prerequisite graph behind them."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {PATHS.map((path) => (
          <Card key={path.href}>
            <CardHeader>
              <CardTitle>
                <Link href={path.href}>{path.title}</Link>
              </CardTitle>
              <CardDescription>{path.detail}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
      {today ? (
        <section className="rounded-xl border border-border p-5">
          <div className="flex items-center gap-2">
            <Badge>Today</Badge>
            <span className="text-xs text-muted-foreground">{today.frontmatter.publishedAt}</span>
          </div>
          <h2 className="mt-2 font-heading text-xl font-medium">
            <Link href={`/daily/${today.frontmatter.slug}`}>{today.frontmatter.title}</Link>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{today.frontmatter.summary}</p>
        </section>
      ) : null}
      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-medium">Tracks</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {TRACK_LIST.map((track) => {
            const count = lessonsForTrack(track.id).length;
            const start = lessonsForTrack(track.id)[0];
            return (
              <Card key={track.id}>
                <CardHeader>
                  <CardTitle>
                    <Link href={track.href}>{track.title}</Link>
                  </CardTitle>
                  <CardDescription>{track.summary}</CardDescription>
                  <p className="text-xs text-muted-foreground">
                    {count} lessons
                    {start ? (
                      <>
                        {" · "}
                        <Link href={lessonUrl(start.frontmatter)} className="underline-offset-4 hover:underline">
                          Start: {start.frontmatter.title}
                        </Link>
                      </>
                    ) : null}
                  </p>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>
      <p className="text-sm text-muted-foreground">
        Looking for a topic by name? Open search with ⌘K or browse{" "}
        <Link href="/knowledge-graph" className="underline-offset-4 hover:underline">
          the knowledge graph
        </Link>
        . Role paths live on{" "}
        <Link href="/roadmaps" className="underline-offset-4 hover:underline">
          /roadmaps
        </Link>
        . {TRACKS.dsa.shortTitle} cheatsheet:{" "}
        <Link href="/cheatsheets/dsa" className="underline-offset-4 hover:underline">
          /cheatsheets/dsa
        </Link>
        .
      </p>
    </div>
  );
}
