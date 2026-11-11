"use client";

import { useMemo, useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MODELS = [
  { id: "gpt-4.1-mini", input: 0.4, output: 1.6 },
  { id: "gpt-4.1", input: 2, output: 8 },
  { id: "claude-sonnet-4", input: 3, output: 15 },
  { id: "llama-3.3-70b", input: 0.7, output: 0.8 },
];

export function LlmCostTool() {
  const [model, setModel] = useState(MODELS[0].id);
  const [inputTokens, setInputTokens] = useState(2500);
  const [outputTokens, setOutputTokens] = useState(400);
  const [calls, setCalls] = useState(10000);
  const chosen = MODELS.find((item) => item.id === model) ?? MODELS[0];

  const cost = useMemo(() => {
    const perCall = (inputTokens / 1_000_000) * chosen.input + (outputTokens / 1_000_000) * chosen.output;
    return { perCall, monthly: perCall * calls };
  }, [chosen, inputTokens, outputTokens, calls]);

  return (
    <div className="flex flex-col gap-4">
      <Field>
        <FieldLabel>Model (list prices per 1M tokens, USD)</FieldLabel>
        <Select value={model} onValueChange={(v) => v && setModel(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODELS.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.id} · in ${item.input} / out ${item.output}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="in-tok">Input tokens</FieldLabel>
          <Input id="in-tok" type="number" value={inputTokens} onChange={(e) => setInputTokens(Number(e.target.value) || 0)} />
        </Field>
        <Field>
          <FieldLabel htmlFor="out-tok">Output tokens</FieldLabel>
          <Input id="out-tok" type="number" value={outputTokens} onChange={(e) => setOutputTokens(Number(e.target.value) || 0)} />
        </Field>
        <Field>
          <FieldLabel htmlFor="calls">Calls / month</FieldLabel>
          <Input id="calls" type="number" value={calls} onChange={(e) => setCalls(Number(e.target.value) || 0)} />
        </Field>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-3">
          <dt className="text-xs text-muted-foreground">Per call</dt>
          <dd className="font-mono text-2xl">${cost.perCall.toFixed(5)}</dd>
        </div>
        <div className="rounded-lg border border-border p-3">
          <dt className="text-xs text-muted-foreground">Monthly</dt>
          <dd className="font-mono text-2xl">${cost.monthly.toFixed(2)}</dd>
        </div>
      </dl>
      <p className="text-sm text-muted-foreground">
        Prices change. Treat this as an envelope, then add embedding + rerank + retries. Caching identical prompts is
        the cheapest optimization.
      </p>
    </div>
  );
}
