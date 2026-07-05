"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import type { GlobeInstance } from "globe.gl";

const CAPITALS = [
  { name: "Washington, D.C.", lat: 38.9, lng: -77.03 },
  { name: "London", lat: 51.51, lng: -0.13 },
  { name: "Paris", lat: 48.86, lng: 2.35 },
  { name: "Cairo", lat: 30.04, lng: 31.24 },
  { name: "Nairobi", lat: -1.29, lng: 36.82 },
  { name: "New Delhi", lat: 28.61, lng: 77.21 },
  { name: "Beijing", lat: 39.9, lng: 116.4 },
  { name: "Tokyo", lat: 35.68, lng: 139.69 },
  { name: "Canberra", lat: -35.28, lng: 149.13 },
  { name: "Brasília", lat: -15.79, lng: -47.88 },
  { name: "Moscow", lat: 55.75, lng: 37.62 },
  { name: "Cape Town", lat: -33.92, lng: 18.42 },
];

export function RealisticGlobeInner({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;

    import("globe.gl").then(({ default: Globe }) => {
      if (disposed || !container) return;

      const globe = new Globe(container)
        .backgroundColor("rgba(0,0,0,0)")
        .showAtmosphere(true)
        .atmosphereColor("#7dd3fc")
        .atmosphereAltitude(0.22)
        .globeImageUrl(
          resolvedTheme === "dark"
            ? "/globe/earth-night.webp"
            : "/globe/earth-day.webp"
        )
        .bumpImageUrl("/globe/earth-bump.webp")
        .pointsData(CAPITALS)
        .pointLat("lat")
        .pointLng("lng")
        .pointColor(() => "#38bdf8")
        .pointAltitude(0.005)
        .pointRadius(0.35)
        .pointLabel("name")
        .enablePointerInteraction(true);

      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.6;
      globe.controls().enableZoom = false;
      globe.controls().enablePan = false;

      globe.pointOfView({ lat: 18, lng: 10, altitude: 2.1 });

      globeRef.current = globe;

      const resize = () => {
        const rect = container.getBoundingClientRect();
        globe.width(rect.width).height(rect.height);
      };
      resize();
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
    });

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      const globe = globeRef.current;
      if (globe) {
        globe.controls().autoRotate = false;
        globe._destructor?.();
      }
      if (container) container.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    globe.globeImageUrl(
      resolvedTheme === "dark" ? "/globe/earth-night.webp" : "/globe/earth-day.webp"
    );
  }, [resolvedTheme]);

  return <div ref={containerRef} className={className} />;
}
