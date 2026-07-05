"use client";

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { SearchableCountry } from "@/lib/data/countries";
import { useRecentlyViewed } from "@/lib/hooks/use-recently-viewed";
import { OPEN_SEARCH_EVENT } from "@/lib/search-events";

export function CommandSearch({
  countries,
  open,
  onOpenChange,
}: {
  countries: SearchableCountry[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { recentlyViewed } = useRecentlyViewed();

  const fuse = useMemo(
    () =>
      new Fuse(countries, {
        keys: [
          { name: "name", weight: 2 },
          { name: "officialName", weight: 1 },
          { name: "capital", weight: 1 },
          { name: "region", weight: 0.5 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [countries]
  );

  const byCca3 = useMemo(
    () => new Map(countries.map((c) => [c.cca3, c])),
    [countries]
  );

  const results = useMemo(() => {
    if (!query.trim()) return countries.slice(0, 8);
    return fuse.search(query, { limit: 8 }).map((r) => r.item);
  }, [query, fuse, countries]);

  const recentCountries = useMemo(
    () =>
      recentlyViewed
        .map((code) => byCca3.get(code))
        .filter((c): c is SearchableCountry => Boolean(c))
        .slice(0, 5),
    [recentlyViewed, byCca3]
  );

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const goTo = (cca3: string) => {
    onOpenChange(false);
    router.push(`/country/${cca3.toLowerCase()}`);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search countries"
      description="Search by country, capital, or region"
    >
      <Command shouldFilter={false}>
      <CommandInput
        placeholder="Search countries, capitals, regions..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No countries found.</CommandEmpty>
        {!query.trim() && recentCountries.length > 0 && (
          <CommandGroup heading="Recently viewed">
            {recentCountries.map((c) => (
              <CommandItem
                key={`recent-${c.cca3}`}
                value={`recent-${c.name}-${c.cca3}`}
                onSelect={() => goTo(c.cca3)}
              >
                <span className="text-lg">{c.flagEmoji}</span>
                <span>{c.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {c.region}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        <CommandGroup heading={query.trim() ? "Results" : "Countries"}>
          {results.map((c) => (
            <CommandItem
              key={c.cca3}
              value={`${c.name}-${c.cca3}`}
              onSelect={() => goTo(c.cca3)}
            >
              <span className="text-lg">{c.flagEmoji}</span>
              <span>{c.name}</span>
              {c.capital && (
                <span className="text-xs text-muted-foreground">
                  {c.capital}
                </span>
              )}
              <span className="ml-auto text-xs text-muted-foreground">
                {c.region}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      </Command>
    </CommandDialog>
  );
}

export function useCommandSearchShortcut(setOpen: Dispatch<SetStateAction<boolean>>) {
  const setOpenRef = useRef(setOpen);
  setOpenRef.current = setOpen;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenRef.current((open) => !open);
      }
    }
    function onOpenEvent() {
      setOpenRef.current(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_SEARCH_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpenEvent);
    };
  }, []);
}
