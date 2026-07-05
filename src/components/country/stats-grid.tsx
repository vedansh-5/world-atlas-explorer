import {
  Banknote,
  Building2,
  Car,
  Clock,
  Coins,
  Languages,
  Map as MapIcon,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/country/stat-card";
import {
  formatArea,
  formatCallingCode,
  formatCurrencyList,
  formatDrivingSide,
  formatGdp,
  formatLanguageList,
  formatPopulation,
  formatTimezones,
} from "@/lib/format";
import type { Country } from "@/lib/types";

export function StatsGrid({ country }: { country: Country }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <StatCard
        label="Capital"
        icon={<Building2 className="size-3.5" />}
        value={country.capital[0] ?? "—"}
      />
      <StatCard
        label="Population"
        icon={<Users className="size-3.5" />}
        value={formatPopulation(country.population)}
      />
      <StatCard
        label="Area"
        icon={<MapIcon className="size-3.5" />}
        value={formatArea(country.area)}
      />
      <StatCard
        label="GDP"
        icon={<Banknote className="size-3.5" />}
        value={formatGdp(country.gdpUsd)}
        hint={country.gdpUsd ? "Current US$, World Bank" : undefined}
      />
      <StatCard
        label="Timezones"
        icon={<Clock className="size-3.5" />}
        value={formatTimezones(country.timezones)}
      />
      <StatCard
        label="Calling code"
        icon={<span className="text-xs">☎</span>}
        value={formatCallingCode(country.idd)}
      />
      <StatCard
        label="Languages"
        icon={<Languages className="size-3.5" />}
        value={formatLanguageList(country.languages)}
      />
      <StatCard
        label="Currency"
        icon={<Coins className="size-3.5" />}
        value={formatCurrencyList(country.currencies)}
      />
      <StatCard
        label="Driving side"
        icon={<Car className="size-3.5" />}
        value={formatDrivingSide(country.drivingSide)}
      />
    </div>
  );
}
