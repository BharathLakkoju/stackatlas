export function reportError(error: unknown, context?: string): void {
  const message = error instanceof Error ? error.message : String(error);
  if (process.env.SENTRY_DSN && typeof fetch === "function") {
    void fetch("/api/error", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message, context }),
    }).catch(() => undefined);
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    console.error(context ?? "StackAtlas", error);
  }
}
