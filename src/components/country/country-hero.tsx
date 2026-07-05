import Image from "next/image";
import { CountryActions } from "@/components/country/country-actions";
import { Badge } from "@/components/ui/badge";
import type { Country } from "@/lib/types";

export function CountryHero({ country }: { country: Country }) {
  return (
    <div className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 -z-10">
        <Image
          src={country.flags.png640}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover opacity-20 blur-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/85 to-background" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border/60 shadow-md sm:h-20 sm:w-30">
              <Image
                src={country.flags.png640}
                alt={`Flag of ${country.name.common}`}
                fill
                priority
                sizes="(max-width: 640px) 96px, 120px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {country.name.common}
                </h1>
                {country.coatOfArms && (
                  <div className="relative size-9 shrink-0 sm:size-11">
                    <Image
                      src={country.coatOfArms}
                      alt={`Coat of arms of ${country.name.common}`}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
              </div>
              <p className="mt-1 text-muted-foreground">
                {country.name.official}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="secondary">{country.region}</Badge>
                {country.subregion && (
                  <Badge variant="secondary">{country.subregion}</Badge>
                )}
                {country.unMember && <Badge variant="outline">UN Member</Badge>}
                {country.landlocked && (
                  <Badge variant="outline">Landlocked</Badge>
                )}
              </div>
            </div>
          </div>
          <CountryActions cca3={country.cca3} />
        </div>
      </div>
    </div>
  );
}
