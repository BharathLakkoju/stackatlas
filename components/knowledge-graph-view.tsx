import Link from "next/link";
import { buildGraph } from "@/lib/content/graph";
import { TRACK_IDS } from "@/lib/content/tracks";

const COLS = TRACK_IDS.length;

export function KnowledgeGraphView() {
  const graph = buildGraph();
  const nodes = [...graph.nodes.values()];
  const byTrack = TRACK_IDS.map((track, col) => ({
    track,
    col,
    items: nodes.filter((node) => node.track === track),
  }));
  const width = 1100;
  const height = 640;
  const positions = new Map<string, { x: number; y: number }>();
  for (const group of byTrack) {
    group.items.forEach((node, index) => {
      positions.set(node.slug, {
        x: 80 + group.col * (width / COLS),
        y: 50 + index * 90,
      });
    });
  }
  const edges: { from: string; to: string }[] = [];
  for (const [from, tos] of graph.outbound) {
    for (const to of tos) edges.push({ from, to });
  }

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[900px]" role="img" aria-label="Topic prerequisite graph">
        {edges.map((edge) => {
          const a = positions.get(edge.from);
          const b = positions.get(edge.to);
          if (!a || !b) return null;
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className="stroke-border"
              strokeWidth="1.5"
            />
          );
        })}
        {nodes.map((node) => {
          const pos = positions.get(node.slug);
          if (!pos) return null;
          return (
            <a key={node.slug} href={node.href}>
              <circle cx={pos.x} cy={pos.y} r="8" className="fill-primary" />
              <text x={pos.x + 12} y={pos.y + 4} className="fill-foreground text-[11px]">
                {node.title}
              </text>
            </a>
          );
        })}
      </svg>
      <ul className="sr-only">
        {nodes.map((node) => (
          <li key={node.slug}>
            <Link href={node.href}>{node.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
