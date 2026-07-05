import { cn } from "@/lib/utils";
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

interface Row {
  label: string;
  values: [React.ReactNode, React.ReactNode];
  winner?: 0 | 1 | null;
}

function numericRow(
  label: string,
  a: number | null,
  b: number | null,
  format: (v: number | null) => string,
  higherIsWinner = true
): Row {
  let winner: 0 | 1 | null = null;
  if (a != null && b != null && a !== b) {
    winner = higherIsWinner === (a > b) ? 0 : 1;
  }
  return { label, values: [format(a), format(b)], winner };
}

export function CompareTable({
  countryA,
  countryB,
}: {
  countryA: Country;
  countryB: Country;
}) {
  const rows: Row[] = [
    numericRow("Population", countryA.population, countryB.population, formatPopulation),
    numericRow("Area", countryA.area, countryB.area, formatArea),
    numericRow("GDP", countryA.gdpUsd, countryB.gdpUsd, formatGdp),
    {
      label: "Capital",
      values: [countryA.capital[0] ?? "—", countryB.capital[0] ?? "—"],
    },
    {
      label: "Region",
      values: [
        `${countryA.region}${countryA.subregion ? ` · ${countryA.subregion}` : ""}`,
        `${countryB.region}${countryB.subregion ? ` · ${countryB.subregion}` : ""}`,
      ],
    },
    {
      label: "Languages",
      values: [
        formatLanguageList(countryA.languages),
        formatLanguageList(countryB.languages),
      ],
    },
    {
      label: "Currency",
      values: [
        formatCurrencyList(countryA.currencies),
        formatCurrencyList(countryB.currencies),
      ],
    },
    {
      label: "Timezones",
      values: [
        formatTimezones(countryA.timezones),
        formatTimezones(countryB.timezones),
      ],
    },
    {
      label: "Calling code",
      values: [formatCallingCode(countryA.idd), formatCallingCode(countryB.idd)],
    },
    {
      label: "Driving side",
      values: [
        formatDrivingSide(countryA.drivingSide),
        formatDrivingSide(countryB.drivingSide),
      ],
    },
    {
      label: "Landlocked",
      values: [countryA.landlocked ? "Yes" : "No", countryB.landlocked ? "Yes" : "No"],
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60">
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={cn(
            "grid grid-cols-[110px_1fr_1fr] items-center gap-2 px-4 py-3 text-sm sm:grid-cols-[160px_1fr_1fr]",
            i % 2 === 1 && "bg-muted/30"
          )}
        >
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {row.label}
          </div>
          <div
            className={cn(
              "truncate font-medium",
              row.winner === 0 && "text-primary"
            )}
          >
            {row.values[0]}
          </div>
          <div
            className={cn(
              "truncate font-medium",
              row.winner === 1 && "text-primary"
            )}
          >
            {row.values[1]}
          </div>
        </div>
      ))}
    </div>
  );
}
