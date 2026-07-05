import Link from "next/link";
import { SectionHeader } from "@/components/shared/section-header";

const CONTINENT_META: Record<string, { emoji: string; blurb: string }> = {
  Africa: { emoji: "🌍", blurb: "59 nations, ancient civilizations" },
  Americas: { emoji: "🌎", blurb: "From the Arctic to Patagonia" },
  Asia: { emoji: "🌏", blurb: "The largest and most populous" },
  Europe: { emoji: "🏛️", blurb: "Dense history, dense borders" },
  Oceania: { emoji: "🏝️", blurb: "Islands across the Pacific" },
  Antarctic: { emoji: "🧊", blurb: "Territories of the far south" },
};

export function ContinentGrid({
  regions,
}: {
  regions: { name: string; count: number }[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeader
        title="Browse by continent"
        subtitle="Every region of the world, one tap away"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {regions.map((region) => {
          const meta = CONTINENT_META[region.name] ?? { emoji: "🗺️", blurb: "" };
          return (
            <Link
              key={region.name}
              href={`/continent/${region.name.toLowerCase()}`}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-5 text-center transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-black/5"
            >
              <span className="text-3xl transition-transform group-hover:scale-110">
                {meta.emoji}
              </span>
              <span className="font-medium">{region.name}</span>
              <span className="text-xs text-muted-foreground">
                {region.count} countries
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
