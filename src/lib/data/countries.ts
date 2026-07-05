import countriesJson from "@/data/countries.json";
import unescoJson from "@/data/unesco.json";
import parksJson from "@/data/parks.json";
import elevationJson from "@/data/elevation.json";
import citiesJson from "@/data/cities.json";
import airportsJson from "@/data/airports.json";
import type {
  Airport,
  Country,
  ElevationExtremes,
  HeritageSite,
  MajorCity,
  NationalPark,
} from "@/lib/types";

const countries = countriesJson as unknown as Country[];
const unescoByIso3 = unescoJson as unknown as Record<string, HeritageSite[]>;
const parksByIso3 = parksJson as unknown as Record<string, NationalPark[]>;
const elevationByIso3 = elevationJson as unknown as Record<
  string,
  ElevationExtremes
>;
const citiesByIso3 = citiesJson as unknown as Record<string, MajorCity[]>;
const airportsByIso2 = airportsJson as unknown as Record<string, Airport[]>;

const byCca3 = new Map(countries.map((c) => [c.cca3, c]));
const byCca2 = new Map(countries.map((c) => [c.cca2, c]));

export function getAllCountries(): Country[] {
  return countries;
}

export interface SearchableCountry {
  cca3: string;
  cca2: string;
  name: string;
  officialName: string;
  capital: string;
  region: string;
  flagEmoji: string;
}

export function getSearchIndex(): SearchableCountry[] {
  return countries.map((c) => ({
    cca3: c.cca3,
    cca2: c.cca2,
    name: c.name.common,
    officialName: c.name.official,
    capital: c.capital[0] ?? "",
    region: c.region,
    flagEmoji: c.flagEmoji,
  }));
}

export function getCountryByCode(code: string): Country | undefined {
  const upper = code.toUpperCase();
  return byCca3.get(upper) ?? byCca2.get(upper);
}

export function getUnescoSites(cca3: string): HeritageSite[] {
  return unescoByIso3[cca3] ?? [];
}

export function getNationalParks(cca3: string): NationalPark[] {
  return parksByIso3[cca3] ?? [];
}

export function getElevationExtremes(cca3: string): ElevationExtremes | null {
  return elevationByIso3[cca3] ?? null;
}

export function getMajorCities(cca3: string): MajorCity[] {
  return citiesByIso3[cca3] ?? [];
}

export function getAirports(cca2: string): Airport[] {
  return airportsByIso2[cca2] ?? [];
}

export function getNeighbours(country: Country): Country[] {
  return country.borders
    .map((code) => byCca3.get(code))
    .filter((c): c is Country => Boolean(c));
}

export function getCountriesByRegion(region: string): Country[] {
  return countries.filter((c) => c.region === region);
}

export function getAllRegions(): string[] {
  return [...new Set(countries.map((c) => c.region))].sort();
}

export function getCountriesSortedByPopulation(): Country[] {
  return [...countries]
    .filter((c) => c.population != null)
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0));
}

export interface LanguageGroup {
  code: string;
  name: string;
  countries: Country[];
}

export function getCountriesByLanguage(): LanguageGroup[] {
  const map = new Map<string, LanguageGroup>();
  for (const country of countries) {
    for (const [code, name] of Object.entries(country.languages)) {
      if (!map.has(code)) map.set(code, { code, name, countries: [] });
      map.get(code)!.countries.push(country);
    }
  }
  return [...map.values()].sort(
    (a, b) => b.countries.length - a.countries.length
  );
}

export interface CurrencyGroup {
  code: string;
  name: string;
  symbol: string;
  countries: Country[];
}

export function getCountriesByCurrency(): CurrencyGroup[] {
  const map = new Map<string, CurrencyGroup>();
  for (const country of countries) {
    for (const [code, info] of Object.entries(country.currencies)) {
      if (!map.has(code)) {
        map.set(code, { code, name: info.name, symbol: info.symbol, countries: [] });
      }
      map.get(code)!.countries.push(country);
    }
  }
  return [...map.values()].sort(
    (a, b) => b.countries.length - a.countries.length
  );
}
