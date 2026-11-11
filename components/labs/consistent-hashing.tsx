"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 360;
}

export function ConsistentHashingLab() {
  const [nodes, setNodes] = useState(["cache-a", "cache-b", "cache-c"]);
  const [key, setKey] = useState("user:42");
  const [name, setName] = useState("cache-d");

  const ring = useMemo(() => nodes.map((node) => ({ node, angle: hash(node) })).sort((a, b) => a.angle - b.angle), [nodes]);
  const keyAngle = hash(key);
  const owner = ring.find((item) => item.angle >= keyAngle)?.node ?? ring[0]?.node;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_16rem]">
      <svg viewBox="0 0 320 320" className="w-full max-w-md" role="img" aria-label="Consistent hashing ring">
        <circle cx="160" cy="160" r="120" fill="none" className="stroke-border" strokeWidth="2" />
        {ring.map((item) => {
          const rad = ((item.angle - 90) * Math.PI) / 180;
          const x = 160 + 120 * Math.cos(rad);
          const y = 160 + 120 * Math.sin(rad);
          return (
            <g key={item.node}>
              <circle cx={x} cy={y} r="7" className="fill-primary" />
              <text x={x} y={y - 12} textAnchor="middle" className="fill-foreground text-[10px]">
                {item.node}
              </text>
            </g>
          );
        })}
        {(() => {
          const rad = ((keyAngle - 90) * Math.PI) / 180;
          const x = 160 + 120 * Math.cos(rad);
          const y = 160 + 120 * Math.sin(rad);
          return <circle cx={x} cy={y} r="5" className="fill-foreground" />;
        })()}
      </svg>
      <div className="flex flex-col gap-3">
        <p className="text-sm">
          Key <span className="font-mono">{key}</span> at {keyAngle}° maps to <strong>{owner}</strong>.
        </p>
        <Field>
          <FieldLabel htmlFor="hash-key">Lookup key</FieldLabel>
          <Input id="hash-key" value={key} onChange={(e) => setKey(e.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor="hash-node">Add node</FieldLabel>
          <Input id="hash-node" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <div className="flex gap-2">
          <Button onClick={() => name && setNodes((prev) => (prev.includes(name) ? prev : [...prev, name]))}>Add</Button>
          <Button variant="outline" onClick={() => setNodes((prev) => prev.slice(0, -1))} disabled={nodes.length < 2}>
            Remove last
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Only keys whose hash sits between the removed node and the previous node move. That is the whole point of the ring.
        </p>
      </div>
    </div>
  );
}
