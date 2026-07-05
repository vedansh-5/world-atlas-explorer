import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Landmark, Trees } from "lucide-react";
import { CountryHero } from "@/components/country/country-hero";
import { StatsGrid } from "@/components/country/stats-grid";
import { CountryMap } from "@/components/country/country-map";
import { WeatherCard } from "@/components/country/weather-card";
import { NeighboursList } from "@/components/country/neighbours-list";
import { ElevationCard } from "@/components/country/elevation-card";
import { SiteList } from "@/components/country/site-list";
import { CitiesAirports } from "@/components/country/cities-airports";
import { ImageGallery } from "@/components/country/image-gallery";
import { Section } from "@/components/country/section";
import { RecordView } from "@/components/country/record-view";
import {
  getAllCountries,
  getAirports,
  getCountryByCode,
  getElevationExtremes,
  getMajorCities,
  getNationalParks,
  getNeighbours,
  getUnescoSites,
} from "@/lib/data/countries";

export function generateStaticParams() {
  return getAllCountries().map((c) => ({ code: c.cca3.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const country = getCountryByCode(code);
  if (!country) return {};
  return {
    title: country.name.common,
    description: `${country.name.official} — capital ${country.capital[0] ?? "n/a"}, population ${country.population?.toLocaleString() ?? "unknown"}, in ${country.region}${country.subregion ? `, ${country.subregion}` : ""}.`,
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const country = getCountryByCode(code);
  if (!country) notFound();

  const neighbours = getNeighbours(country);
  const unesco = getUnescoSites(country.cca3);
  const parks = getNationalParks(country.cca3);
  const elevation = getElevationExtremes(country.cca3);
  const cities = getMajorCities(country.cca3);
  const airports = getAirports(country.cca2);

  const mapCenter = country.capitalCoordinates ??
    (country.latlng ? { lat: country.latlng[0], lng: country.latlng[1] } : { lat: 0, lng: 0 });

  return (
    <div>
      <RecordView cca3={country.cca3} />
      <CountryHero country={country} />

      <div className="mx-auto max-w-5xl divide-y divide-border/60 px-4 sm:px-6">
        <Section title="Overview">
          <StatsGrid country={country} />
        </Section>

        <Section title="Map">
          <CountryMap
            center={mapCenter}
            zoom={country.capitalCoordinates ? 6 : 4}
            capital={country.capitalCoordinates}
            capitalName={country.capital[0] ?? null}
            cities={cities}
            airports={airports}
            parks={parks}
          />
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <LegendDot color="bg-primary" label="Capital" />
            <LegendDot color="bg-amber-500" label="Major city" />
            <LegendDot color="bg-sky-500" label="Airport" />
            <LegendDot color="bg-green-500" label="National park" />
          </div>
        </Section>

        <Section title={`Weather in ${country.capital[0] ?? "the capital"}`}>
          <WeatherCard
            coordinates={country.capitalCoordinates}
            capitalName={country.capital[0] ?? null}
          />
        </Section>

        <Section title="Neighbouring countries">
          <NeighboursList neighbours={neighbours} />
        </Section>

        <Section title="Elevation extremes">
          <ElevationCard elevation={elevation} />
        </Section>

        <Section
          title="UNESCO World Heritage Sites"
          subtitle={unesco.length > 0 ? `${unesco.length} sites` : undefined}
        >
          <SiteList
            sites={unesco}
            icon={Landmark}
            emptyLabel="No UNESCO World Heritage Sites recorded for this country."
          />
        </Section>

        <Section
          title="National parks"
          subtitle={parks.length > 0 ? `${parks.length} parks` : undefined}
        >
          <SiteList
            sites={parks}
            icon={Trees}
            emptyLabel="No national parks recorded for this country."
          />
        </Section>

        <Section title="Cities & airports">
          <CitiesAirports cities={cities} airports={airports} />
        </Section>

        <Section title="Gallery">
          <ImageGallery commonName={country.name.common} />
        </Section>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}
