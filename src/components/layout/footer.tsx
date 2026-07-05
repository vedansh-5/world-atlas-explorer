export function Footer() {
  return (
    <footer className="border-t border-border/60 py-8 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 text-center sm:px-6">
        <p>
          World Atlas Explorer — data from REST-free public sources:
          world-countries, World Bank, Wikidata, OurAirports, Open-Meteo, and
          Wikipedia.
        </p>
        <p>Built for exploration, not for navigation. Borders shown are informational.</p>
      </div>
    </footer>
  );
}
