import type { QuizQuestion } from "@/lib/content/schema";
import { QuizClient } from "./quiz-client";

export function Quiz({ questions = [] }: { questions?: QuizQuestion[] }) {
  return <QuizClient questions={questions} />;
}
