"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { Airport, LatLng, MajorCity, NationalPark } from "@/lib/types";

const capitalIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:9999px;background:var(--color-primary);border:2px solid white;box-shadow:0 0 0 2px rgba(0,0,0,0.15)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const cityIcon = L.divIcon({
  className: "",
  html: `<div style="width:9px;height:9px;border-radius:9999px;background:#f59e0b;border:1.5px solid white"></div>`,
  iconSize: [9, 9],
  iconAnchor: [4.5, 4.5],
});

const airportIcon = L.divIcon({
  className: "",
  html: `<div style="width:9px;height:9px;border-radius:9999px;background:#0ea5e9;border:1.5px solid white"></div>`,
  iconSize: [9, 9],
  iconAnchor: [4.5, 4.5],
});

const parkIcon = L.divIcon({
  className: "",
  html: `<div style="width:9px;height:9px;border-radius:9999px;background:#22c55e;border:1.5px solid white"></div>`,
  iconSize: [9, 9],
  iconAnchor: [4.5, 4.5],
});

export function CountryMapInner({
  center,
  zoom,
  capital,
  capitalName,
  cities,
  airports,
  parks,
}: {
  center: LatLng;
  zoom: number;
  capital: LatLng | null;
  capitalName: string | null;
  cities: MajorCity[];
  airports: Airport[];
  parks: NationalPark[];
}) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      className="size-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {capital && (
        <Marker position={[capital.lat, capital.lng]} icon={capitalIcon}>
          <Popup>
            <strong>{capitalName}</strong>
            <br />
            Capital city
          </Popup>
        </Marker>
      )}
      {cities.map(
        (city) =>
          city.coordinates && (
            <Marker
              key={city.name}
              position={[city.coordinates.lat, city.coordinates.lng]}
              icon={cityIcon}
            >
              <Popup>
                <strong>{city.name}</strong>
                <br />
                {city.population.toLocaleString()} people
              </Popup>
            </Marker>
          )
      )}
      {airports.map(
        (airport) =>
          airport.coordinates && (
            <Marker
              key={airport.name}
              position={[airport.coordinates.lat, airport.coordinates.lng]}
              icon={airportIcon}
            >
              <Popup>
                <strong>{airport.name}</strong>
                {airport.iata && <>{" "}({airport.iata})</>}
                <br />
                {airport.municipality}
              </Popup>
            </Marker>
          )
      )}
      {parks.map(
        (park) =>
          park.coordinates && (
            <Marker
              key={park.name}
              position={[park.coordinates.lat, park.coordinates.lng]}
              icon={parkIcon}
            >
              <Popup>
                <strong>{park.name}</strong>
                <br />
                National park
              </Popup>
            </Marker>
          )
      )}
    </MapContainer>
  );
}
