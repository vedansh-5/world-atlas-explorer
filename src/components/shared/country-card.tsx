"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPopulation } from "@/lib/format";
import type { Country } from "@/lib/types";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { useCompareTray } from "@/lib/hooks/use-compare-tray";

export function CountryCard({
  country,
  index = 0,
  className,
}: {
  country: Country;
  index?: number;
  className?: string;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparing, toggleCompare, isFull } = useCompareTray();
  const favorite = isFavorite(country.cca3);
  const comparing = isComparing(country.cca3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-lg hover:shadow-black/5",
        className
      )}
    >
      <Link href={`/country/${country.cca3.toLowerCase()}`} className="block">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <Image
            src={country.flags.png640}
            alt={`Flag of ${country.name.common}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold tracking-tight">
              {country.name.common}
            </h3>
          </div>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
            {country.capital[0] ?? "No capital"} · {country.region}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatPopulation(country.population)} people
          </p>
        </div>
      </Link>

      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <button
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorite}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(country.cca3);
          }}
          className={cn(
            "flex size-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70",
            favorite && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <Heart className={cn("size-3.5", favorite && "fill-current")} />
        </button>
        <button
          aria-label={comparing ? "Remove from comparison" : "Add to comparison"}
          aria-pressed={comparing}
          disabled={!comparing && isFull}
          onClick={(e) => {
            e.preventDefault();
            toggleCompare(country.cca3);
          }}
          className={cn(
            "flex size-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-40",
            comparing && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <Scale className="size-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
