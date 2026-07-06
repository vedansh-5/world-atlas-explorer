"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Search } from "lucide-react";
import { RealisticGlobe } from "@/components/hero/realistic-globe";
import { openGlobalSearch } from "@/lib/search-events";

const REVEAL_SCROLL_DISTANCE = 500;

function useGlobeDimensions() {
  const [dims, setDims] = useState({ peek: 300, full: 620 });

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 768) setDims({ peek: 440, full: 860 });
      else if (width >= 640) setDims({ peek: 380, full: 720 });
      else setDims({ peek: 260, full: 520 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return dims;
}

export function Hero({
  countryCount,
  languageCount,
}: {
  countryCount: number;
  languageCount: number;
}) {
  const { peek, full } = useGlobeDimensions();

  const scrollY = useMotionValue(0);
  useEffect(() => {
    const onScroll = () => scrollY.set(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollY]);

  const rawHeight = useTransform(
    scrollY,
    [0, REVEAL_SCROLL_DISTANCE],
    [peek, full]
  );
  const height = useSpring(rawHeight, {
    stiffness: 120,
    damping: 26,
    mass: 0.5,
  });
  const fadeOpacity = useTransform(
    scrollY,
    [0, REVEAL_SCROLL_DISTANCE * 0.7],
    [1, 0]
  );

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.25 }}
        style={{ height }}
        className="relative z-0 mx-auto mt-10 w-full max-w-5xl overflow-hidden sm:mt-14"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 rounded-full"
          style={{
            width: full * 1.15,
            height: full * 1.15,
            background:
              "radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(56,189,248,0.12) 45%, transparent 72%)",
          }}
        />
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{ width: full, height: full }}
        >
          <RealisticGlobe className="size-full" />
        </div>
        <motion.div
          style={{ opacity: fadeOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background sm:h-24"
        />
      </motion.div>

      <p className="mb-16 mt-4 text-center text-xs text-muted-foreground sm:mb-20">
        Drag to rotate · click a country to explore
      </p>
    </section>
  );
}
