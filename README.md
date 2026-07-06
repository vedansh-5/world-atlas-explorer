# World Atlas Explorer

A fast, beautifully designed explorer for every country on Earth — flags, capitals,
population, GDP, maps, weather, UNESCO sites, national parks, airports, and more.

**Live:** [world-atlas-explorer.vercel.app](https://world-atlas-explorer.vercel.app)

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion ·
TanStack Query · React-Leaflet/OpenStreetMap · globe.gl (Three.js) · next-themes · Fuse.js

## Routes

All routes below are live on production and statically prerendered (except the three
marked dynamic).

| Route | Description |
|---|---|
| [`/`](https://world-atlas-explorer.vercel.app/) | Homepage — globe hero, search, browse-by sections, favorites/recently-viewed strips |
| [`/country/fra`](https://world-atlas-explorer.vercel.app/country/fra) | Country detail (France) — stats, map, weather, UNESCO, parks, cities, airports, gallery |
| [`/country/jpn`](https://world-atlas-explorer.vercel.app/country/jpn) | Country detail (Japan) |
| [`/continent/asia`](https://world-atlas-explorer.vercel.app/continent/asia) | Browse by continent (also: `africa`, `americas`, `antarctic`, `europe`, `oceania`) |
| [`/browse/population`](https://world-atlas-explorer.vercel.app/browse/population) | All countries ranked by population |
| [`/browse/language`](https://world-atlas-explorer.vercel.app/browse/language) | Language index |
| [`/browse/language/eng`](https://world-atlas-explorer.vercel.app/browse/language/eng) | Countries speaking a given language |
| [`/browse/currency`](https://world-atlas-explorer.vercel.app/browse/currency) | Currency index |
| [`/browse/currency/USD`](https://world-atlas-explorer.vercel.app/browse/currency/USD) | Countries using a given currency |
| [`/compare`](https://world-atlas-explorer.vercel.app/compare) | Side-by-side country comparison |
| [`/favorites`](https://world-atlas-explorer.vercel.app/favorites) | Saved countries (localStorage) |
| `/api/weather?lat=&lon=` | Dynamic — live weather + sunrise/sunset for a coordinate |
| `/api/images/[name]` | Dynamic — Wikipedia photo gallery for a country's common name |
| `/api/countries?codes=FRA,DEU` | Dynamic — batch country lookup, used by favorites/recently-viewed/compare |

`generateStaticParams` produces this at build time: 250 `/country/[code]`, 6
`/continent/[name]`, ~155 `/browse/language/[code]`, and ~160 `/browse/currency/[code]`
pages — 583 pages total, all static HTML.

## Architecture

```
scripts/
  generate-data.mjs       one-time/rerunnable: world-countries + World Bank + Wikidata
                           → src/data/{countries,unesco,parks,elevation,cities}.json
  generate-airports.mjs   OurAirports CSV → src/data/airports.json

src/
  data/*.json             build-time snapshot, imported directly by server code (never
                           shipped to the client — only type-only imports cross that line)
  lib/
    types.ts              shared domain types (Country, HeritageSite, WeatherSnapshot, ...)
    data/countries.ts     the only module that reads src/data/*.json; exposes typed
                           getters (getCountryByCode, getCountriesByLanguage, ...)
    format.ts             number/currency/area/GDP formatters
    hooks/                client hooks: use-favorites, use-recently-viewed,
                           use-compare-tray (all built on one localStorage primitive,
                           use-local-list, via useSyncExternalStore so every component
                           sharing a key re-renders in sync), use-weather,
                           use-country-images, use-countries-by-codes
  components/
    hero/                 canvas-drawn rotating globe + hero search CTA
    search/               ⌘K command palette (Fuse.js fuzzy search over all countries)
    home/, shared/        homepage sections, CountryCard/CountryGrid used everywhere
    country/              every section of the country detail page (map, weather,
                           stats, UNESCO/parks lists, gallery, ...)
    compare/               compare picker, slots, and the stat comparison table
    ui/                    shadcn/ui primitives (Radix-based)
  app/
    page.tsx               homepage (server component, reads lib/data directly)
    country/[code]/         country detail (SSG via generateStaticParams)
    continent/[name]/,
    browse/.../             the other SSG listing pages
    compare/, favorites/    client-driven pages (localStorage state)
    api/weather, api/images,
    api/countries            the only three routes that do real request-time work
```

**Data flow.** Server components (`page.tsx` files) import `lib/data/countries.ts`
directly and render fully static HTML — no client-side fetch for anything that doesn't
change. Interactive state (favorites, recently-viewed, compare selections) lives in
`localStorage` and is fetched back into full `Country` objects through the lightweight
`/api/countries` route so the client bundle never has to carry the ~1.2 MB dataset.
Weather and the photo gallery are the only things fetched live, through their own route
handlers with `revalidate` caching, because they're the only things that actually
change day to day.

## Data

No API keys required, anywhere. Two kinds of data:

**Baked at build time** (`npm run generate:all`), into `src/data/*.json`:
- Core country facts — [`world-countries`](https://github.com/mledoze/countries) (MIT)
- Population & GDP — [World Bank Open Data API](https://data.worldbank.org/)
- Coat of arms, driving side, capital coordinates, UNESCO World Heritage Sites,
  national parks, elevation extremes, major cities — [Wikidata Query Service](https://query.wikidata.org/)
- Timezones — [`countries-and-timezones`](https://github.com/manuelmhtr/countries-and-timezones) (IANA tz data)
- Airports — [OurAirports](https://ourairports.com/data/) open dataset
- Flags — [flagcdn.com](https://flagcdn.com/) (deterministic URLs, no fetch needed)
- Homepage globe textures (day/night Earth, bump map) — re-compressed to WebP from the
  [`three-globe`](https://github.com/vasturiano/three-globe) example assets (MIT,
  NASA Blue Marble/Black Marble imagery), self-hosted in `public/globe/`
- Homepage globe country outlines — [`world-atlas`](https://github.com/topojson/world-atlas)
  110m TopoJSON (ISC), self-hosted in `public/globe/countries-110m.json`, paired with a
  generated `public/globe/country-code-map.json` (numeric ISO → `cca3`) so clicking a
  country on the globe opens its `/country/[code]` page

Re-run the generators any time to refresh the snapshot:
```bash
npm run generate:all   # or generate:data / generate:airports individually
```

**Fetched live at request time**, since it has to be current:
- Weather + sunrise/sunset — [Open-Meteo](https://open-meteo.com/) (`/api/weather`)
- Country photo gallery — Wikipedia's media-list + imageinfo APIs (`/api/images/[name]`)

Wikidata is crowdsourced — UNESCO/park counts are a best effort (a documented
heuristic excludes serial-site sub-components) and won't perfectly match official
tallies for every country.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

Fully static-generatable (`generateStaticParams` covers all countries, continents,
languages, and currencies — 583 pages prerendered at build time) and deploys to
Vercel with zero configuration or environment variables.

## Deployment

Live at **[world-atlas-explorer.vercel.app](https://world-atlas-explorer.vercel.app)**,
deployed via the Vercel CLI and connected to this GitHub repo for automatic deploys on
push to `main`.
