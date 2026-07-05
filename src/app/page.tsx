import { Hero } from "@/components/hero/hero";
import { ContinentGrid } from "@/components/home/continent-grid";
import { PopulationLeaderboard } from "@/components/home/population-leaderboard";
import {
  CurrencyPreview,
  LanguagePreview,
} from "@/components/home/language-currency-preview";
import { RecentlyViewedStrip } from "@/components/home/recently-viewed-strip";
import { FavoritesStrip } from "@/components/home/favorites-strip";
import {
  getAllCountries,
  getAllRegions,
  getCountriesByCurrency,
  getCountriesByLanguage,
  getCountriesByRegion,
  getCountriesSortedByPopulation,
} from "@/lib/data/countries";

export default function Home() {
  const countries = getAllCountries();
  const regions = getAllRegions().map((name) => ({
    name,
    count: getCountriesByRegion(name).length,
  }));
  const byPopulation = getCountriesSortedByPopulation();
  const languages = getCountriesByLanguage();
  const currencies = getCountriesByCurrency();

  return (
    <div className="flex flex-col">
      <Hero countryCount={countries.length} languageCount={languages.length} />
      <FavoritesStrip />
      <RecentlyViewedStrip />
      <ContinentGrid regions={regions} />
      <PopulationLeaderboard countries={byPopulation} />
      <LanguagePreview languages={languages} />
      <CurrencyPreview currencies={currencies} />
    </div>
  );
}
