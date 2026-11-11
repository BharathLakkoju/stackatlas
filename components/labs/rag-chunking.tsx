"use client";

import { useMemo, useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const SAMPLE = `Retrieval-augmented generation splits a corpus into chunks, embeds each chunk, and retrieves the nearest neighbors for a query. Overlap preserves sentences that would otherwise be cut at a window boundary. Too-small chunks lose context; too-large chunks dilute the embedding and blow the prompt budget.`;

function chunkText(text: string, size: number, overlap: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const step = Math.max(1, size - overlap);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += step) {
    chunks.push(words.slice(i, i + size).join(" "));
    if (i + size >= words.length) break;
  }
  return chunks;
}

export function RagChunkingLab() {
  const [text, setText] = useState(SAMPLE);
  const [size, setSize] = useState(24);
  const [overlap, setOverlap] = useState(8);
  const chunks = useMemo(() => chunkText(text, size, overlap), [text, size, overlap]);

  return (
    <div className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="corpus">Corpus</FieldLabel>
        <Textarea id="corpus" rows={6} value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="size">Chunk size (words)</FieldLabel>
          <Input
            id="size"
            type="number"
            min={4}
            value={size}
            onChange={(e) => setSize(Number(e.target.value) || 4)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="overlap">Overlap (words)</FieldLabel>
          <Input
            id="overlap"
            type="number"
            min={0}
            value={overlap}
            onChange={(e) => setOverlap(Number(e.target.value) || 0)}
          />
        </Field>
      </div>
      <p className="text-sm text-muted-foreground">
        {chunks.length} chunks. Overlap {overlap} means neighboring windows share tokens so a sentence split across a
        boundary can still retrieve.
      </p>
      <ol className="flex flex-col gap-2">
        {chunks.map((chunk, index) => (
          <li key={`${index}-${chunk.slice(0, 12)}`} className="rounded-lg border border-border p-3 text-sm">
            <span className="text-xs text-muted-foreground">#{index + 1}</span>
            <p>{chunk}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
