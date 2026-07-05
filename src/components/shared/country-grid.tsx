import { CountryCard } from "@/components/shared/country-card";
import type { Country } from "@/lib/types";

export function CountryGrid({
  countries,
  emptyMessage = "No countries found.",
}: {
  countries: Country[];
  emptyMessage?: string;
}) {
  if (countries.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {countries.map((country, i) => (
        <CountryCard key={country.cca3} country={country} index={i} />
      ))}
    </div>
  );
}
