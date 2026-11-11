"use client";

import { useMemo, useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const ROWS = [
  { name: "O(1)", fn: () => 1, note: "Hash lookup, array index" },
  { name: "O(log n)", fn: (n: number) => Math.log2(Math.max(n, 1)), note: "Binary search" },
  { name: "O(n)", fn: (n: number) => n, note: "Single scan" },
  { name: "O(n log n)", fn: (n: number) => n * Math.log2(Math.max(n, 1)), note: "Efficient sort" },
  { name: "O(n²)", fn: (n: number) => n * n, note: "Nested loops" },
  { name: "O(2ⁿ)", fn: (n: number) => 2 ** Math.min(n, 24), note: "Unmemoized subsets" },
];

export function BigOTool() {
  const [n, setN] = useState(1000);
  const rows = useMemo(() => ROWS.map((row) => ({ ...row, value: row.fn(n) })), [n]);

  return (
    <div className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="n">Input size n</FieldLabel>
        <Input id="n" type="number" min={1} value={n} onChange={(e) => setN(Number(e.target.value) || 1)} />
      </Field>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2">Class</th>
              <th>Approx. ops at n</th>
              <th>Typical algorithm</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b border-border/60">
                <td className="py-2 font-mono">{row.name}</td>
                <td className="font-mono">{Math.round(row.value).toLocaleString()}</td>
                <td className="text-muted-foreground">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
