import Link from "next/link";
import Image from "next/image";
import type { Country } from "@/lib/types";

export function NeighboursList({ neighbours }: { neighbours: Country[] }) {
  if (neighbours.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No land borders — this country is surrounded by water.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {neighbours.map((country) => (
        <Link
          key={country.cca3}
          href={`/country/${country.cca3.toLowerCase()}`}
          className="flex items-center gap-2 rounded-full border border-border/60 bg-card py-1.5 pl-1.5 pr-4 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <span className="relative size-6 shrink-0 overflow-hidden rounded-full">
            <Image
              src={country.flags.png}
              alt=""
              fill
              sizes="24px"
              className="object-cover"
            />
          </span>
          {country.name.common}
        </Link>
      ))}
    </div>
  );
}
