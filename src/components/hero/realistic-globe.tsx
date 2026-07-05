"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const RealisticGlobeInner = dynamic(
  () => import("./realistic-globe-inner").then((m) => m.RealisticGlobeInner),
  {
    ssr: false,
    loading: () => (
      <div className="size-full animate-pulse rounded-full bg-gradient-to-br from-sky-500/20 via-primary/10 to-transparent blur-2xl" />
    ),
  }
);

export function RealisticGlobe({ className }: { className?: string }) {
  return <RealisticGlobeInner className={cn(className)} />;
}
