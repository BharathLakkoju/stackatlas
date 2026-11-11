"use client";

import { useEffect, useMemo, useState } from "react";
import MiniSearch from "minisearch";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import type { SearchDoc } from "@/lib/content/search-index";

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [docs, setDocs] = useState<SearchDoc[]>([]);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open || docs.length) return;
    void fetch("/search-index.json")
      .then((res) => res.json())
      .then((data: SearchDoc[]) => setDocs(data));
  }, [open, docs.length]);

  const mini = useMemo(() => {
    const search = new MiniSearch<SearchDoc>({
      fields: ["title", "summary", "tags", "headings", "kind", "track"],
      storeFields: ["title", "summary", "url", "kind", "track"],
    });
    if (docs.length) search.addAll(docs);
    return search;
  }, [docs]);

  const results = query.trim() ? mini.search(query, { prefix: true, fuzzy: 0.2 }).slice(0, 12) : docs.slice(0, 8);

  return (
    <>
      <Button variant="outline" className="max-w-xs justify-start text-muted-foreground" onClick={() => setOpen(true)}>
        <SearchIcon data-icon="inline-start" />
        Search
        <kbd className="ml-auto hidden rounded border border-border px-1.5 text-[10px] md:inline">⌘K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search StackAtlas">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search lessons, labs, interview questions…" value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>No matching pages. Try a pattern name like “sliding window”.</CommandEmpty>
            <CommandGroup heading="Results">
              {results.map((hit) => {
                const id = "id" in hit ? String(hit.id) : "";
                const doc = "url" in hit ? (hit as SearchDoc) : docs.find((item) => item.id === id);
                if (!doc?.url) return null;
                return (
                  <CommandItem
                    key={doc.url}
                    value={`${doc.title} ${doc.url}`}
                    onSelect={() => {
                      setOpen(false);
                      router.push(doc.url);
                    }}
                  >
                    <span className="flex flex-col gap-0.5">
                      <span>{doc.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {doc.kind} · {doc.track}
                      </span>
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
