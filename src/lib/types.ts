export interface LatLng {
  lat: number;
  lng: number;
}

export interface Country {
  cca2: string;
  cca3: string;
  ccn3: string | null;
  name: {
    common: string;
    official: string;
  };
  independent: boolean;
  unMember: boolean;
  status: string;
  capital: string[];
  capitalCoordinates: LatLng | null;
  region: string;
  subregion: string | null;
  languages: Record<string, string>;
  currencies: Record<string, { name: string; symbol: string }>;
  idd: { root: string | null; suffixes: string[] };
  tld: string[];
  latlng: [number, number] | null;
  landlocked: boolean;
  borders: string[];
  area: number | null;
  flagEmoji: string;
  demonyms: Record<string, { f: string; m: string }>;
  drivingSide: "left" | "right" | null;
  coatOfArms: string | null;
  timezones: string[];
  population: number | null;
  gdpUsd: number | null;
  flags: {
    svg: string;
    png: string;
    png640: string;
  };
  maps: {
    googleMaps: string | null;
    openStreetMap: string | null;
  };
}

export interface HeritageSite {
  name: string;
  coordinates: LatLng | null;
}

export interface NationalPark {
  name: string;
  coordinates: LatLng | null;
}

export interface ElevationPoint {
  name: string;
  elevationMeters: number | null;
  coordinates: LatLng | null;
}

export interface ElevationExtremes {
  highest: ElevationPoint | null;
  lowest: ElevationPoint | null;
}

export interface MajorCity {
  name: string;
  population: number;
  coordinates: LatLng | null;
}

export interface Airport {
  name: string;
  iata: string | null;
  icao: string | null;
  municipality: string | null;
  type: "large" | "medium";
  coordinates: LatLng;
}

export interface WeatherSnapshot {
  temperatureC: number;
  apparentTemperatureC: number;
  weatherCode: number;
  windSpeedKph: number;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  timezone: string;
  observedAt: string;
}

export interface CountryImage {
  url: string;
  width: number;
  height: number;
  description: string | null;
  source: "wikipedia";
  pageUrl: string;
}
