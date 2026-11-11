"use client";

import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useProgress, useToggleComplete } from "@/lib/use-progress";

export type RoadmapNodeView = {
  id: string;
  label: string;
  description: string;
  slug?: string;
  href?: string;
};

export function RoadmapView({ nodes }: { nodes: RoadmapNodeView[] }) {
  const { completed } = useProgress();
  const toggle = useToggleComplete();
  const done = new Set(completed);
  const total = nodes.filter((node) => node.slug).length;
  const finished = nodes.filter((node) => node.slug && done.has(node.slug)).length;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        {finished} / {total} lessons marked complete on this device.
      </p>
      <ol className="flex flex-col gap-3">
        {nodes.map((node, index) => {
          const checked = node.slug ? done.has(node.slug) : false;
          return (
            <li key={node.id} className="rounded-xl border border-border p-4">
              <div className="flex items-start gap-3">
                {node.slug ? (
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => node.slug && toggle(node.slug)}
                    aria-label={`Mark ${node.label} complete`}
                  />
                ) : (
                  <span className="mt-1 size-4 rounded-full border border-border" />
                )}
                <div className="flex flex-col gap-1">
                  <p className="font-medium">
                    {String(index + 1).padStart(2, "0")} · {node.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{node.description}</p>
                  {node.href ? (
                    <Link href={node.href} className="text-sm underline-offset-4 hover:underline">
                      Open lesson
                    </Link>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
