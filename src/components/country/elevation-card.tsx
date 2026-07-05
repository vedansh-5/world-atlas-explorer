import { ArrowDown, ArrowUp } from "lucide-react";
import { formatElevation } from "@/lib/format";
import type { ElevationExtremes } from "@/lib/types";

export function ElevationCard({
  elevation,
}: {
  elevation: ElevationExtremes | null;
}) {
  if (!elevation || (!elevation.highest && !elevation.lowest)) {
    return (
      <p className="text-sm text-muted-foreground">
        Elevation extremes are not available for this country.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {elevation.highest && (
        <div className="rounded-2xl border border-border/60 bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <ArrowUp className="size-3.5 text-emerald-500" />
            Highest point
          </div>
          <div className="mt-1.5 text-lg font-semibold tracking-tight">
            {elevation.highest.name}
          </div>
          <div className="mt-0.5 text-sm text-muted-foreground">
            {formatElevation(elevation.highest.elevationMeters)}
          </div>
        </div>
      )}
      {elevation.lowest && (
        <div className="rounded-2xl border border-border/60 bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <ArrowDown className="size-3.5 text-sky-500" />
            Lowest point
          </div>
          <div className="mt-1.5 text-lg font-semibold tracking-tight">
            {elevation.lowest.name}
          </div>
          <div className="mt-0.5 text-sm text-muted-foreground">
            {formatElevation(elevation.lowest.elevationMeters)}
          </div>
        </div>
      )}
    </div>
  );
}
