"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { RealisticGlobe } from "@/components/hero/realistic-globe";
import { openGlobalSearch } from "@/lib/search-events";

export function Hero({
  countryCount,
  languageCount,
}: {
  countryCount: number;
  languageCount: number;
}) {
  return (
    <section className="relative overflow-x-hidden border-b border-border/60">
      <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-20 text-center sm:px-6 sm:pt-28">
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

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="relative z-0 mx-auto mb-16 mt-12 aspect-square w-full max-w-[320px] sm:mb-20 sm:mt-16 sm:max-w-[480px] md:max-w-[560px]"
      >
        <RealisticGlobe className="size-full" />
        <p className="pointer-events-none absolute inset-x-0 -bottom-8 text-center text-xs text-muted-foreground sm:-bottom-10">
          Drag to rotate · click a country to explore
        </p>
      </motion.div>
    </section>
  );
}
