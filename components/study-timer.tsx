"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { appendStudy } from "@/lib/progress";
import { emitProgress, useStudyLog } from "@/lib/use-progress";

export function StudyTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [topic, setTopic] = useState("sliding-window");
  const log = useStudyLog();

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setRunning(false);
          appendStudy({ topic, minutes: 25, at: new Date().toISOString() });
          emitProgress();
          return 25 * 60;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, topic]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-6xl tracking-tight" aria-live="polite">
        {mm}:{ss}
      </p>
      <Field>
        <FieldLabel htmlFor="topic">Topic slug</FieldLabel>
        <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
      </Field>
      <div className="flex gap-2">
        <Button onClick={() => setRunning((v) => !v)}>{running ? "Pause" : "Start"}</Button>
        <Button
          variant="outline"
          onClick={() => {
            setRunning(false);
            setSeconds(25 * 60);
          }}
        >
          Reset
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            appendStudy({
              topic,
              minutes: Math.round((25 * 60 - seconds) / 60) || 1,
              at: new Date().toISOString(),
            });
            emitProgress();
          }}
        >
          Log time
        </Button>
      </div>
      <ul className="flex flex-col gap-2 text-sm">
        {log.length === 0 ? <li className="text-muted-foreground">No sessions yet. Start a timer or log time.</li> : null}
        {log.map((entry) => (
          <li key={entry.at} className="rounded-lg border border-border px-3 py-2">
            {entry.minutes} min on <span className="font-mono">{entry.topic}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
