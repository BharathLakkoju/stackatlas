"use client";

import { useMemo, useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function CapacityTool() {
  const [dau, setDau] = useState(1_000_000);
  const [reads, setReads] = useState(20);
  const [writes, setWrites] = useState(2);
  const [payloadKb, setPayloadKb] = useState(2);

  const math = useMemo(() => {
    const qps = (dau * (reads + writes)) / 86400;
    const writeQps = (dau * writes) / 86400;
    const storageGbPerDay = (dau * writes * payloadKb) / 1024 / 1024;
    const bandwidthMBps = (qps * payloadKb) / 1024;
    return { qps, writeQps, storageGbPerDay, bandwidthMBps };
  }, [dau, reads, writes, payloadKb]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="dau">Daily active users</FieldLabel>
        <Input id="dau" type="number" value={dau} onChange={(e) => setDau(Number(e.target.value) || 0)} />
      </Field>
      <Field>
        <FieldLabel htmlFor="reads">Reads / user / day</FieldLabel>
        <Input id="reads" type="number" value={reads} onChange={(e) => setReads(Number(e.target.value) || 0)} />
      </Field>
      <Field>
        <FieldLabel htmlFor="writes">Writes / user / day</FieldLabel>
        <Input id="writes" type="number" value={writes} onChange={(e) => setWrites(Number(e.target.value) || 0)} />
      </Field>
      <Field>
        <FieldLabel htmlFor="payload">Payload KB</FieldLabel>
        <Input id="payload" type="number" value={payloadKb} onChange={(e) => setPayloadKb(Number(e.target.value) || 1)} />
      </Field>
      <dl className="md:col-span-2 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-3">
          <dt className="text-xs text-muted-foreground">Average QPS</dt>
          <dd className="font-mono text-2xl">{math.qps.toFixed(0)}</dd>
        </div>
        <div className="rounded-lg border border-border p-3">
          <dt className="text-xs text-muted-foreground">Write QPS</dt>
          <dd className="font-mono text-2xl">{math.writeQps.toFixed(0)}</dd>
        </div>
        <div className="rounded-lg border border-border p-3">
          <dt className="text-xs text-muted-foreground">New storage / day</dt>
          <dd className="font-mono text-2xl">{math.storageGbPerDay.toFixed(2)} GB</dd>
        </div>
        <div className="rounded-lg border border-border p-3">
          <dt className="text-xs text-muted-foreground">Payload bandwidth</dt>
          <dd className="font-mono text-2xl">{math.bandwidthMBps.toFixed(2)} MB/s</dd>
        </div>
      </dl>
      <p className="md:col-span-2 text-sm text-muted-foreground">
        Peak is often 2–5× average. Multiply QPS by a peak factor before you size connection pools or partitions.
      </p>
    </div>
  );
}
