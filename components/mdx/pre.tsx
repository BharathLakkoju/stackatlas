"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pre({ children, ...props }: React.ComponentProps<"pre">) {
  const [copied, setCopied] = useState(false);

  function textFrom(node: React.ReactNode): string {
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (!node) return "";
    if (Array.isArray(node)) return node.map(textFrom).join("");
    if (typeof node === "object" && "props" in node) {
      return textFrom((node as { props: { children?: React.ReactNode } }).props.children);
    }
    return "";
  }

  async function onCopy() {
    await navigator.clipboard.writeText(textFrom(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="group relative">
      <pre {...props} className="overflow-x-auto rounded-xl border border-border bg-muted p-4 text-sm">
        {children}
      </pre>
      <Button
        size="icon-sm"
        variant="outline"
        className="absolute top-2 right-2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
        onClick={onCopy}
        aria-label="Copy code"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  );
}
