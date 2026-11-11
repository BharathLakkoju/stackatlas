"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/lib/content/schema";

export function QuizClient({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="not-prose my-8 rounded-xl border border-border bg-card p-5">
      <h2 className="font-heading text-lg font-medium">Mini-quiz</h2>
      <ol className="mt-4 flex flex-col gap-6">
        {questions.map((question, qIndex) => (
          <li key={question.prompt} className="flex flex-col gap-3">
            <p className="font-medium">{question.prompt}</p>
            <div className="flex flex-col gap-2" role="radiogroup" aria-label={question.prompt}>
              {question.choices.map((choice, cIndex) => {
                const selected = answers[qIndex] === cIndex;
                const correct = revealed && cIndex === question.answer;
                const wrong = revealed && selected && cIndex !== question.answer;
                return (
                  <button
                    key={choice}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setAnswers((prev) => ({ ...prev, [qIndex]: cIndex }))}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      correct
                        ? "border-primary bg-primary/10"
                        : wrong
                          ? "border-destructive bg-destructive/10"
                          : selected
                            ? "border-ring bg-muted"
                            : "border-border hover:bg-muted/60"
                    }`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
            {revealed ? <p className="text-sm text-muted-foreground">{question.explanation}</p> : null}
          </li>
        ))}
      </ol>
      <Button className="mt-4" onClick={() => setRevealed(true)}>
        Check answers
      </Button>
    </section>
  );
}
