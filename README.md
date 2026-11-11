# StackAtlas

Public developer learning hub: mapped courses, roadmaps, labs, daily explainers, interview banks, and tools across DSA, system design, JavaScript/TypeScript, Python, Java, cloud, and AI engineering.

Progress is stored in the browser (`localStorage`). There is no account required to read.

## Setup

```bash
pnpm install
pnpm dev
```

The app listens on port **4317**. Open `http://localhost:4317`.

Quality gates (also run as `prebuild`):

```bash
pnpm content:check      # schema, slugs, links, orphans, completeness
pnpm content:snippets   # TS / Python / Java / bash / Dockerfile fences
pnpm content:jsonld     # JSON-LD helper types
pnpm content:report     # per-track counts → .cache/content-report.json
pnpm build
```

Copy `.env.example` if you want a production site URL or a Resend newsletter key. Without `RESEND_API_KEY`, signup still succeeds locally and tells the reader the digest is not emailed yet.

## Content authoring

All pages that are “documents” live under `content/` as MDX (roadmaps are JSON).

Required lesson frontmatter:

| Field | Notes |
| --- | --- |
| `title`, `slug`, `summary` | Unique kebab `slug` across the whole site |
| `kind` | `lesson` \| `cheatsheet` \| `interview` \| `daily` \| `blog` \| `lab` \| `changelog` \| `compare` |
| `track` | `dsa` \| `system-design` \| `js-ts` \| `python` \| `java` \| `cloud` \| `ai` |
| `module`, `order` | Lessons only |
| `difficulty` | `beginner` \| `intermediate` \| `advanced` |
| `prerequisites` | Lesson slugs. Empty + `root: true` for track starts |
| `tags`, `related` | Related must exist |
| `estimatedMinutes`, `lastReviewed` | `YYYY-MM-DD` |

Lesson body should include: why, one mental model, complete code fences, common mistakes, `<Quiz questions={[...]} />`, interview angles. “What to learn next” is injected from the graph on the lesson template.

Code fences must parse:

- `ts` / `tsx` / `js` via TypeScript
- `python` via `ast.parse`
- `java` via `javac` (Spring imports are brace-checked)
- `bash` via `bash -n`
- `dockerfile` must include `FROM`

Do not put `import` statements in MDX. `Quiz` and `Callout` are provided by the MDX component map.

## Deployment

1. Push to GitHub. CI runs the same gates plus `tsc`, lint, production build, and Lighthouse budgets (performance / accessibility / SEO ≥ 0.95) against `/`, `/dsa`, and a lesson.
2. Import the repo in Vercel (framework: Next.js). Set `NEXT_PUBLIC_SITE_URL` to the production origin. If install still ignores `pnpm-lock.yaml`, add project env `ENABLE_EXPERIMENTAL_COREPACK=1` (build + install). The repo already pins `packageManager` to pnpm 10 and Node 22.
3. Preview deployments are created per pull request by Vercel.

Analytics use `@vercel/analytics` and Speed Insights. Error reporting is a no-op unless you later add a DSN-backed `/api/error` handler.

## 30-day growth plan

Cadence

- Publish **one daily explainer** every weekday (already routed at `/daily/[slug]` with RSS).
- Ship **two full lessons** each week, always attached to an existing track root so they are not orphans.
- One lab or tool improvement every other week.

Promote first (highest search + share value)

1. `/learn/dsa/patterns/sliding-window`
2. `/learn/system-design/case-studies/url-shortener`
3. `/labs/rag-chunking` and `/learn/ai/rag/rag`
4. `/learn/js-ts/internals/event-loop`
5. `/learn/python/fastapi/fastapi-di`
6. `/compare/langchain-vs-langgraph` and `/compare/ecs-vs-eks`

Channels

- Hacker News: “Mapped learning hub with a failing-build content graph”
- Reddit: r/cscareerquestions, r/ExperiencedDevs, r/cscareerquestionsEU — post the URL shortener + sliding window pair, not a dump of the homepage
- Dev.to / Hashnode: canonical URL back to StackAtlas; do not duplicate the full lesson
- LinkedIn / X: OG images from `/api/og`
- IndexNow + Google Search Console on week one; submit `sitemap.xml` and `/daily/feed.xml`

Measurement: Search Console queries for “explained”, “vs”, and design-a-X pages. Double down on tags that already cluster on `/topics/[tag]`.
