"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { GlobeInstance } from "globe.gl";
import type { GeoPermissibleObjects } from "d3-geo";
import type { Topology } from "topojson-specification";

interface CountryFeature {
  type: "Feature";
  id: string;
  properties: Record<string, unknown>;
  geometry: GeoPermissibleObjects;
}

type CodeMap = Record<string, { code: string; name: string }>;

const LAND_COLOR = "rgba(56, 189, 248, 0.35)";
const LAND_HOVER_COLOR = "rgba(56, 189, 248, 0.75)";
const LAND_STROKE = "rgba(226, 245, 255, 0.55)";

export function RealisticGlobeInner({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;
    let rotateTimeout: ReturnType<typeof setTimeout> | null = null;

    Promise.all([
      import("globe.gl"),
      import("topojson-client"),
      fetch("/globe/countries-110m.json").then((r) => r.json()) as Promise<Topology>,
      fetch("/globe/country-code-map.json").then((r) => r.json()) as Promise<CodeMap>,
    ]).then(([{ default: Globe }, topojson, topology, codeMap]) => {
      if (disposed || !container) return;

      const countriesObject = topology.objects.countries;
      const geo = topojson.feature(
        topology,
        countriesObject as never
      ) as unknown as { features: CountryFeature[] };
      const countries = geo.features.filter((f) => f.id !== "010");

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
        .polygonsData(countries)
        .polygonGeoJsonGeometry("geometry" as never)
        .polygonCapColor(() => LAND_COLOR)
        .polygonSideColor(() => "rgba(56, 189, 248, 0.15)")
        .polygonStrokeColor(() => LAND_STROKE)
        .polygonAltitude(0.006)
        .polygonsTransitionDuration(150)
        .onPolygonHover((hoverFeature) => {
          const feature = hoverFeature as CountryFeature | null;
          globe
            .polygonCapColor((f) =>
              f === feature ? LAND_HOVER_COLOR : LAND_COLOR
            )
            .polygonAltitude((f) => (f === feature ? 0.02 : 0.006));
          container.style.cursor = feature ? "pointer" : "grab";
        })
        .onPolygonClick((clickedFeature) => {
          const feature = clickedFeature as CountryFeature;
          const entry = codeMap[feature.id];
          if (entry) {
            router.push(`/country/${entry.code.toLowerCase()}`);
          }
        })
        .enablePointerInteraction(true);

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.enableZoom = true;
      controls.enablePan = false;
      controls.minDistance = 150;
      controls.maxDistance = 420;

      const pauseAutoRotate = () => {
        controls.autoRotate = false;
        if (rotateTimeout) clearTimeout(rotateTimeout);
      };
      const resumeAutoRotateSoon = () => {
        if (rotateTimeout) clearTimeout(rotateTimeout);
        rotateTimeout = setTimeout(() => {
          controls.autoRotate = true;
        }, 4000);
      };
      controls.addEventListener("start", pauseAutoRotate);
      controls.addEventListener("end", resumeAutoRotateSoon);

      globe.pointOfView({ lat: 18, lng: 10, altitude: 2.2 });
      container.style.cursor = "grab";

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
      if (rotateTimeout) clearTimeout(rotateTimeout);
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
