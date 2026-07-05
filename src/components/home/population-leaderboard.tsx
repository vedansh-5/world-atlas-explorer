import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "@/components/shared/section-header";
import { formatPopulation } from "@/lib/format";
import type { Country } from "@/lib/types";

export function PopulationLeaderboard({ countries }: { countries: Country[] }) {
  const top = countries.slice(0, 8);
  const max = top[0]?.population ?? 1;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeader
        title="Browse by population"
        subtitle="The world's most populous nations"
        href="/browse/population"
      />
      <div className="grid gap-2 rounded-2xl border border-border/60 bg-card p-2 sm:p-4">
        {top.map((country, i) => (
          <Link
            key={country.cca3}
            href={`/country/${country.cca3.toLowerCase()}`}
            className="group relative flex items-center gap-4 overflow-hidden rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/60"
          >
            <span className="w-5 shrink-0 text-sm font-medium text-muted-foreground">
              {i + 1}
            </span>
            <div className="relative h-6 w-9 shrink-0 overflow-hidden rounded-sm bg-muted">
              <Image
                src={country.flags.png}
                alt=""
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <span className="min-w-0 flex-1 truncate font-medium">
              {country.name.common}
            </span>
            <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
              {formatPopulation(country.population)}
            </span>
            <span
              className="absolute inset-y-0 left-0 -z-10 bg-primary/5 transition-all group-hover:bg-primary/10"
              style={{
                width: `${((country.population ?? 0) / max) * 100}%`,
              }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
