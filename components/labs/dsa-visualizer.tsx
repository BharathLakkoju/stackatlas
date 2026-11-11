"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const START = [8, 3, 12, 5, 1, 9, 6, 4];

function bubbleStep(arr: number[]): { next: number[]; swapped: [number, number] | null } {
  const next = [...arr];
  for (let i = 0; i < next.length - 1; i += 1) {
    if (next[i] > next[i + 1]) {
      const tmp = next[i];
      next[i] = next[i + 1];
      next[i + 1] = tmp;
      return { next, swapped: [i, i + 1] };
    }
  }
  return { next, swapped: null };
}

function bfsLayers(edges: [number, number][], start = 0): number[][] {
  const adj = new Map<number, number[]>();
  for (const [a, b] of edges) {
    adj.set(a, [...(adj.get(a) ?? []), b]);
    adj.set(b, [...(adj.get(b) ?? []), a]);
  }
  const seen = new Set<number>([start]);
  const layers: number[][] = [[start]];
  while (true) {
    const frontier: number[] = [];
    for (const node of layers[layers.length - 1]) {
      for (const next of adj.get(node) ?? []) {
        if (!seen.has(next)) {
          seen.add(next);
          frontier.push(next);
        }
      }
    }
    if (!frontier.length) break;
    layers.push(frontier);
  }
  return layers;
}

function dpTable(coins: number[], amount: number): number[] {
  const inf = amount + 1;
  const dp = Array.from({ length: amount + 1 }, () => inf);
  dp[0] = 0;
  for (let x = 1; x <= amount; x += 1) {
    for (const coin of coins) {
      if (coin <= x) dp[x] = Math.min(dp[x], dp[x - coin] + 1);
    }
  }
  return dp.map((v) => (v === inf ? -1 : v));
}

export function DsaVisualizer() {
  const [mode, setMode] = useState("sort");
  const [values, setValues] = useState(START);
  const [highlight, setHighlight] = useState<[number, number] | null>(null);
  const [bfsStep, setBfsStep] = useState(1);
  const layers = useMemo(
    () =>
      bfsLayers(
        [
          [0, 1],
          [0, 2],
          [1, 3],
          [1, 4],
          [2, 5],
        ],
        0,
      ),
    [],
  );
  const visible = layers.slice(0, bfsStep).flat();
  const coins = [1, 3, 4];
  const dp = dpTable(coins, 6);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      <ToggleGroup value={[mode]} onValueChange={(v) => v[0] && setMode(v[0])} variant="outline">
        <ToggleGroupItem value="sort">Bubble sort</ToggleGroupItem>
        <ToggleGroupItem value="bfs">BFS layers</ToggleGroupItem>
        <ToggleGroupItem value="dp">Coin DP</ToggleGroupItem>
      </ToggleGroup>
      {mode === "sort" ? (
        <>
          <div className="flex h-40 items-end gap-2" aria-live="polite">
            {values.map((value, index) => (
              <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-md ${highlight?.includes(index) ? "bg-primary" : "bg-muted-foreground/40"}`}
                  style={{ height: `${value * 10}px` }}
                />
                <span className="text-xs">{value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                const result = bubbleStep(values);
                setValues(result.next);
                setHighlight(result.swapped);
              }}
            >
              Step
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setValues(START);
                setHighlight(null);
              }}
            >
              Reset
            </Button>
          </div>
        </>
      ) : null}
      {mode === "bfs" ? (
        <>
          <p className="text-sm text-muted-foreground">
            Visit neighbors level by level. Queue contents grow by the frontier, not by a stack.
          </p>
          <ol className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5].map((node) => (
              <li
                key={node}
                className={`rounded-full border px-3 py-1 text-sm ${visible.includes(node) ? "border-primary bg-primary/10" : "border-border"}`}
              >
                v{node}
              </li>
            ))}
          </ol>
          <p className="text-sm">Layer {bfsStep}: {layers[bfsStep - 1]?.join(", ")}</p>
          <div className="flex gap-2">
            <Button onClick={() => setBfsStep((s) => Math.min(layers.length, s + 1))}>Expand frontier</Button>
            <Button variant="outline" onClick={() => setBfsStep(1)}>
              Reset
            </Button>
          </div>
        </>
      ) : null}
      {mode === "dp" ? (
        <>
          <p className="text-sm text-muted-foreground">Fewest coins from {coins.join(", ")} to make amount 0…6. −1 means impossible.</p>
          <div className="grid grid-cols-7 gap-2">
            {dp.map((value, amount) => (
              <div key={amount} className="rounded-lg border border-border p-2 text-center">
                <div className="text-xs text-muted-foreground">amt {amount}</div>
                <div className="font-mono text-lg">{value}</div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
