"use client";

export const PROGRESS_KEY = "stackatlas.progress.v1";
export const STUDY_LOG_KEY = "stackatlas.study.v1";

export type ProgressState = {
  completed: string[];
  updatedAt: string;
};

export type StudyEntry = {
  topic: string;
  minutes: number;
  at: string;
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function loadProgress(): ProgressState {
  const state = readJson<ProgressState>(PROGRESS_KEY, { completed: [], updatedAt: "" });
  return { completed: Array.from(new Set(state.completed)), updatedAt: state.updatedAt };
}

export function saveProgress(state: ProgressState): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
}

export function toggleComplete(slug: string): ProgressState {
  const current = loadProgress();
  const set = new Set(current.completed);
  if (set.has(slug)) set.delete(slug);
  else set.add(slug);
  const next = { completed: [...set], updatedAt: new Date().toISOString() };
  saveProgress(next);
  return next;
}

export function isComplete(slug: string): boolean {
  return loadProgress().completed.includes(slug);
}

export function loadStudyLog(): StudyEntry[] {
  return readJson<StudyEntry[]>(STUDY_LOG_KEY, []);
}

export function appendStudy(entry: StudyEntry): StudyEntry[] {
  const next = [entry, ...loadStudyLog()].slice(0, 200);
  localStorage.setItem(STUDY_LOG_KEY, JSON.stringify(next));
  return next;
}
