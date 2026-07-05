"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { GlobeCanvas } from "@/components/hero/globe-canvas";
import { openGlobalSearch } from "@/lib/search-events";

export function Hero({
  countryCount,
  languageCount,
}: {
  countryCount: number;
  languageCount: number;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-60">
        <div className="size-[min(90vw,700px)]">
          <GlobeCanvas className="size-full" />
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_center,_var(--color-background)_45%,_transparent_100%)]" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-28 text-center sm:px-6 sm:py-36">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
        >
          {countryCount} countries · {languageCount}+ languages
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          Explore every country
          <br />
          on Earth
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-5 max-w-xl text-balance text-lg text-muted-foreground"
        >
          Flags, capitals, population, maps, weather, and more — a
          beautifully designed atlas for the entire world.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          onClick={openGlobalSearch}
          className="group mt-9 flex w-full max-w-md items-center gap-3 rounded-full border border-border/70 bg-background/80 px-5 py-3.5 text-left text-muted-foreground shadow-lg shadow-black/5 backdrop-blur-xl transition-all hover:border-primary/50 hover:shadow-xl"
        >
          <Search className="size-4 shrink-0 transition-colors group-hover:text-primary" />
          <span className="flex-1 truncate text-sm">
            Search any country, capital, or region...
          </span>
          <kbd className="hidden shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">
            ⌘K
          </kbd>
        </motion.button>
      </div>
    </section>
  );
}
