"use client";

import { useCallback, useSyncExternalStore } from "react";
import { loadProgress, loadStudyLog, toggleComplete, type ProgressState, type StudyEntry } from "./progress";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("stackatlas-progress", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("stackatlas-progress", onStoreChange);
  };
}

function emit() {
  window.dispatchEvent(new Event("stackatlas-progress"));
}

export function useProgress(): ProgressState {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(loadProgress()),
    () => JSON.stringify({ completed: [], updatedAt: "" }),
  );
  return JSON.parse(snapshot) as ProgressState;
}

export function useToggleComplete() {
  return useCallback((slug: string) => {
    const next = toggleComplete(slug);
    emit();
    return next;
  }, []);
}

export function useStudyLog(): StudyEntry[] {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(loadStudyLog()),
    () => "[]",
  );
  return JSON.parse(snapshot) as StudyEntry[];
}

export { emit as emitProgress };
