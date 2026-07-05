"use client";

import { useQuery } from "@tanstack/react-query";
import type { CountryImage } from "@/lib/types";

async function fetchImages(commonName: string): Promise<CountryImage[]> {
  const res = await fetch(`/api/images/${encodeURIComponent(commonName)}`);
  if (!res.ok) return [];
  return res.json();
}

export function useCountryImages(commonName: string) {
  return useQuery({
    queryKey: ["country-images", commonName],
    queryFn: () => fetchImages(commonName),
    staleTime: 24 * 60 * 60 * 1000,
  });
}
