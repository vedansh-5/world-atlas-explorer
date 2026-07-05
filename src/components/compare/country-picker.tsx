"use client";

import { useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import Fuse from "fuse.js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { SearchableCountry } from "@/lib/data/countries";

export function CountryPicker({
  countries,
  exclude,
  onSelect,
}: {
  countries: SearchableCountry[];
  exclude: string[];
  onSelect: (cca3: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const available = useMemo(
    () => countries.filter((c) => !exclude.includes(c.cca3)),
    [countries, exclude]
  );

  const fuse = useMemo(
    () =>
      new Fuse(available, {
        keys: ["name", "officialName", "capital"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [available]
  );

  const results = useMemo(() => {
    if (!query.trim()) return available.slice(0, 8);
    return fuse.search(query, { limit: 8 }).map((r) => r.item);
  }, [query, fuse, available]);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <button className="flex h-full min-h-56 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
          <PlusCircle className="size-6" />
          <span className="text-sm font-medium">Add a country</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search countries..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No countries found.</CommandEmpty>
            <CommandGroup>
              {results.map((c) => (
                <CommandItem
                  key={c.cca3}
                  value={`${c.name}-${c.cca3}`}
                  onSelect={() => {
                    onSelect(c.cca3);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <span className="text-lg">{c.flagEmoji}</span>
                  <span>{c.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {c.region}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
