"use client";

import { useQuery } from "@tanstack/react-query";
import type { LatLng, WeatherSnapshot } from "@/lib/types";

async function fetchWeather(coords: LatLng): Promise<WeatherSnapshot> {
  const res = await fetch(`/api/weather?lat=${coords.lat}&lon=${coords.lng}`);
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}

export function useWeather(coords: LatLng | null) {
  return useQuery({
    queryKey: ["weather", coords?.lat, coords?.lng],
    queryFn: () => fetchWeather(coords!),
    enabled: coords != null,
    staleTime: 30 * 60 * 1000,
  });
}
