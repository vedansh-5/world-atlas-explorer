"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { Airport, LatLng, MajorCity, NationalPark } from "@/lib/types";

const CountryMapInner = dynamic(
  () => import("./country-map-inner").then((m) => m.CountryMapInner),
  {
    ssr: false,
    loading: () => <Skeleton className="size-full" />,
  }
);

export function CountryMap(props: {
  center: LatLng;
  zoom: number;
  capital: LatLng | null;
  capitalName: string | null;
  cities: MajorCity[];
  airports: Airport[];
  parks: NationalPark[];
}) {
  return (
    <div className="h-[420px] w-full overflow-hidden rounded-2xl border border-border/60">
      <CountryMapInner {...props} />
    </div>
  );
}
