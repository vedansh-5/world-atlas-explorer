"use client";

import { Sunrise, Sunset, Thermometer, Wind } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeather } from "@/lib/hooks/use-weather";
import { weatherCodeLabel } from "@/lib/weather-codes";
import type { LatLng } from "@/lib/types";

function formatTime(iso: string, timezone: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function WeatherCard({
  coordinates,
  capitalName,
}: {
  coordinates: LatLng | null;
  capitalName: string | null;
}) {
  const { data, isLoading, isError } = useWeather(coordinates);

  if (!coordinates) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 text-sm text-muted-foreground">
        Weather isn&apos;t available without known capital coordinates.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 text-sm text-muted-foreground">
        Weather data is temporarily unavailable.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-2xl border border-border/60 bg-card p-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Thermometer className="size-3.5" />
          Now in {capitalName}
        </div>
        <div className="mt-1.5 text-2xl font-semibold tracking-tight">
          {Math.round(data.temperatureC)}°C
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          Feels like {Math.round(data.apparentTemperatureC)}°C
        </div>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-4">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conditions
        </div>
        <div className="mt-1.5 text-lg font-semibold tracking-tight">
          {weatherCodeLabel(data.weatherCode)}
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <Wind className="size-3" />
          {Math.round(data.windSpeedKph)} km/h wind
        </div>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Sunrise className="size-3.5" />
          Sunrise
        </div>
        <div className="mt-1.5 text-2xl font-semibold tracking-tight">
          {formatTime(data.sunrise, data.timezone)}
        </div>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Sunset className="size-3.5" />
          Sunset
        </div>
        <div className="mt-1.5 text-2xl font-semibold tracking-tight">
          {formatTime(data.sunset, data.timezone)}
        </div>
      </div>
    </div>
  );
}
