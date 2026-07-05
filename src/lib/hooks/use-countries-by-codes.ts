"use client";

import { useQuery } from "@tanstack/react-query";
import type { Country } from "@/lib/types";

async function fetchCountries(codes: string[]): Promise<Country[]> {
  if (codes.length === 0) return [];
  const res = await fetch(`/api/countries?codes=${codes.join(",")}`);
  if (!res.ok) return [];
  return res.json();
}

export function useCountriesByCodes(codes: string[]) {
  return useQuery({
    queryKey: ["countries-by-codes", ...codes],
    queryFn: () => fetchCountries(codes),
    enabled: codes.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
