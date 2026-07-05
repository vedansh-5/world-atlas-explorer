import { NextRequest, NextResponse } from "next/server";
import type { WeatherSnapshot } from "@/lib/types";

export const revalidate = 1800; // 30 minutes — weather doesn't need to be second-fresh

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");

  const latNum = Number(lat);
  const lonNum = Number(lon);
  if (!lat || !lon || Number.isNaN(latNum) || Number.isNaN(lonNum)) {
    return NextResponse.json(
      { error: "lat and lon query params are required and must be numbers" },
      { status: 400 }
    );
  }

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latNum));
  url.searchParams.set("longitude", String(lonNum));
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,is_day"
  );
  url.searchParams.set("daily", "sunrise,sunset");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Upstream weather service unavailable" },
      { status: 502 }
    );
  }

  const data = await res.json();

  const snapshot: WeatherSnapshot = {
    temperatureC: data.current.temperature_2m,
    apparentTemperatureC: data.current.apparent_temperature,
    weatherCode: data.current.weather_code,
    windSpeedKph: data.current.wind_speed_10m,
    isDay: data.current.is_day === 1,
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
    timezone: data.timezone,
    observedAt: data.current.time,
  };

  return NextResponse.json(snapshot);
}
