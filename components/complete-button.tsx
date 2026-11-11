"use client";

import { Button } from "@/components/ui/button";
import { useProgress, useToggleComplete } from "@/lib/use-progress";

export function CompleteButton({ slug }: { slug: string }) {
  const { completed } = useProgress();
  const toggle = useToggleComplete();
  const done = completed.includes(slug);

  return (
    <Button variant={done ? "secondary" : "default"} onClick={() => toggle(slug)}>
      {done ? "Completed" : "Mark complete"}
    </Button>
  );
}
