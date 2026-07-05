"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { CountryCard } from "@/components/shared/country-card";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { useCountriesByCodes } from "@/lib/hooks/use-countries-by-codes";

export function FavoritesStrip() {
  const { favorites } = useFavorites();
  const { data: countries } = useCountriesByCodes(favorites.slice(0, 4));

  if (!countries || countries.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeader
        title="Your favorites"
        subtitle="Countries you've saved"
        href="/favorites"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {countries.map((country, i) => (
          <CountryCard key={country.cca3} country={country} index={i} />
        ))}
      </div>
    </section>
  );
}
