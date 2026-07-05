import type { LucideIcon } from "lucide-react";

export function SiteList({
  sites,
  icon: Icon,
  emptyLabel,
}: {
  sites: { name: string }[];
  icon: LucideIcon;
  emptyLabel: string;
}) {
  if (sites.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="grid max-h-72 gap-1.5 overflow-y-auto rounded-2xl border border-border/60 bg-card p-3 sm:grid-cols-2">
      {sites.map((site) => (
        <div
          key={site.name}
          className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted/60"
        >
          <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          <span>{site.name}</span>
        </div>
      ))}
    </div>
  );
}
