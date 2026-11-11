"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string; local?: boolean };
      if (!res.ok) throw new Error(body.error ?? "Signup failed");
      toast.success(
        body.local
          ? "Saved locally. Add RESEND_API_KEY to send the weekly digest."
          : "You're on the weekly digest list.",
      );
      setEmail("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "flex flex-col gap-2 sm:flex-row sm:items-end" : undefined}>
      <FieldGroup className={compact ? "flex-1" : undefined}>
        <Field>
          <FieldLabel htmlFor="newsletter-email">Weekly digest</FieldLabel>
          <Input
            id="newsletter-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={pending} className={compact ? "sm:mb-0" : "mt-3"}>
        {pending ? "Joining…" : "Subscribe"}
      </Button>
    </form>
  );
}
