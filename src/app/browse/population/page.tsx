import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CountryGrid } from "@/components/shared/country-grid";
import { getCountriesSortedByPopulation } from "@/lib/data/countries";

export const metadata: Metadata = { title: "Browse by population" };

export default function PopulationBrowsePage() {
  const countries = getCountriesSortedByPopulation();

  return (
    <div>
      <PageHeader
        title="Browse by population"
        subtitle="All countries, ranked from most to least populous"
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <CountryGrid countries={countries} />
      </div>
    </div>
  );
}
