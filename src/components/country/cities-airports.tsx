import { Building, Plane } from "lucide-react";
import { formatPopulation } from "@/lib/format";
import type { Airport, MajorCity } from "@/lib/types";

export function CitiesAirports({
  cities,
  airports,
}: {
  cities: MajorCity[];
  airports: Airport[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-border/60 bg-card p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Building className="size-3.5" />
          Major cities
        </div>
        {cities.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No major cities data available.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {cities.map((city) => (
              <li
                key={city.name}
                className="flex items-center justify-between py-1.5 text-sm"
              >
                <span>{city.name}</span>
                <span className="tabular-nums text-muted-foreground">
                  {formatPopulation(city.population)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Plane className="size-3.5" />
          Airports
        </div>
        {airports.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No major airports data available.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {airports.slice(0, 10).map((airport) => (
              <li
                key={airport.name}
                className="flex items-center justify-between gap-2 py-1.5 text-sm"
              >
                <span className="truncate">{airport.name}</span>
                {airport.iata && (
                  <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                    {airport.iata}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
