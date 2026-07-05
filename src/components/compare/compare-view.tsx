"use client";

import { Scale, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompareSlot } from "@/components/compare/compare-slot";
import { CountryPicker } from "@/components/compare/country-picker";
import { CompareTable } from "@/components/compare/compare-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompareTray } from "@/lib/hooks/use-compare-tray";
import { useCountriesByCodes } from "@/lib/hooks/use-countries-by-codes";
import type { SearchableCountry } from "@/lib/data/countries";

export function CompareView({ countries }: { countries: SearchableCountry[] }) {
  const { compareList, toggleCompare, removeFromCompare, clearCompare } =
    useCompareTray();
  const { data: selected, isLoading } = useCountriesByCodes(compareList);

  const countryA = selected?.[0];
  const countryB = selected?.[1];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {compareList.length > 0 && (
        <div className="mb-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={clearCompare}>
            <X className="size-3.5" />
            Clear comparison
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {isLoading && compareList.length > 0 ? (
          <>
            <Skeleton className="aspect-[16/9] rounded-2xl" />
            <Skeleton className="aspect-[16/9] rounded-2xl" />
          </>
        ) : (
          <>
            {countryA ? (
              <CompareSlot
                country={countryA}
                onRemove={() => removeFromCompare(countryA.cca3)}
              />
            ) : (
              <CountryPicker
                countries={countries}
                exclude={compareList}
                onSelect={toggleCompare}
              />
            )}
            {countryB ? (
              <CompareSlot
                country={countryB}
                onRemove={() => removeFromCompare(countryB.cca3)}
              />
            ) : (
              <CountryPicker
                countries={countries}
                exclude={compareList}
                onSelect={toggleCompare}
              />
            )}
          </>
        )}
      </div>

      <div className="mt-8">
        {countryA && countryB ? (
          <CompareTable countryA={countryA} countryB={countryB} />
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
            <Scale className="size-8" />
            <p>Pick two countries to see a side-by-side comparison.</p>
          </div>
        )}
      </div>
    </div>
  );
}
