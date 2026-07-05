"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { CountryGrid } from "@/components/shared/country-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { useCountriesByCodes } from "@/lib/hooks/use-countries-by-codes";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { data: countries, isLoading } = useCountriesByCodes(favorites);

  return (
    <div>
      <PageHeader
        title="Your favorites"
        subtitle={
          favorites.length > 0
            ? `${favorites.length} saved countries`
            : "Countries you save will show up here"
        }
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[16/13] rounded-2xl" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 p-16 text-center">
            <Heart className="size-8 text-muted-foreground" />
            <p className="text-muted-foreground">
              You haven&apos;t saved any countries yet.
            </p>
            <Link
              href="/"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Start exploring →
            </Link>
          </div>
        ) : (
          <CountryGrid countries={countries ?? []} />
        )}
      </div>
    </div>
  );
}
