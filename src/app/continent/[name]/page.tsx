import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { CountryGrid } from "@/components/shared/country-grid";
import { getAllRegions, getCountriesByRegion } from "@/lib/data/countries";

export function generateStaticParams() {
  return getAllRegions().map((name) => ({ name: name.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const region = getAllRegions().find((r) => r.toLowerCase() === name);
  if (!region) return {};
  return { title: region };
}

export default async function ContinentPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const region = getAllRegions().find((r) => r.toLowerCase() === name);
  if (!region) notFound();

  const countries = getCountriesByRegion(region).sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );

  return (
    <div>
      <PageHeader
        title={region}
        subtitle={`${countries.length} countries and territories`}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <CountryGrid countries={countries} />
      </div>
    </div>
  );
}
