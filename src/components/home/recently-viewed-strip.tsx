"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { CountryCard } from "@/components/shared/country-card";
import { useRecentlyViewed } from "@/lib/hooks/use-recently-viewed";
import { useCountriesByCodes } from "@/lib/hooks/use-countries-by-codes";

export function RecentlyViewedStrip() {
  const { recentlyViewed } = useRecentlyViewed();
  const { data: countries } = useCountriesByCodes(recentlyViewed);

  if (!countries || countries.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeader title="Recently viewed" subtitle="Pick up where you left off" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {countries.map((country, i) => (
          <CountryCard key={country.cca3} country={country} index={i} />
        ))}
      </div>
    </section>
  );
}
