import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { formatPopulation } from "@/lib/format";
import type { Country } from "@/lib/types";

export function CompareSlot({
  country,
  onRemove,
}: {
  country: Country;
  onRemove: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card">
      <button
        onClick={onRemove}
        aria-label={`Remove ${country.name.common} from comparison`}
        className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
      >
        <X className="size-3.5" />
      </button>
      <div className="relative aspect-[16/9] w-full bg-muted">
        <Image
          src={country.flags.png640}
          alt={`Flag of ${country.name.common}`}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <Link
          href={`/country/${country.cca3.toLowerCase()}`}
          className="font-semibold tracking-tight hover:text-primary"
        >
          {country.name.common}
        </Link>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {country.capital[0] ?? "No capital"} · {formatPopulation(country.population)} people
        </p>
      </div>
    </div>
  );
}
