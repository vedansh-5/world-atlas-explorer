"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe2, Heart, Scale, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  CommandSearch,
  useCommandSearchShortcut,
} from "@/components/search/command-search";
import type { SearchableCountry } from "@/lib/data/countries";
import { useCompareTray } from "@/lib/hooks/use-compare-tray";

export function Navbar({ countries }: { countries: SearchableCountry[] }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { compareList } = useCompareTray();
  useCommandSearchShortcut(setSearchOpen);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <Globe2 className="size-5 text-primary" />
            <span className="hidden sm:inline">World Atlas Explorer</span>
          </Link>

          <button
            onClick={() => setSearchOpen(true)}
            className="ml-2 flex flex-1 max-w-md items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/70"
          >
            <Search className="size-3.5" />
            <span className="truncate">Search countries...</span>
            <kbd className="ml-auto hidden shrink-0 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] sm:inline">
              ⌘K
            </kbd>
          </button>

          <nav className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/compare" aria-label="Compare countries">
                <Scale className="size-4" />
                {compareList.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {compareList.length}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/favorites" aria-label="Favorites">
                <Heart className="size-4" />
              </Link>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <CommandSearch
        countries={countries}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </>
  );
}
