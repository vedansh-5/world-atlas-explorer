// Build-time data generation: merges world-countries (core facts, no API key)
// with World Bank (population/GDP) and Wikidata (coat of arms, driving side,
// capital coordinates, UNESCO sites, national parks, elevation extremes,
// major cities). Run with `npm run generate:data`. Safe to re-run any time —
// it overwrites src/data/*.json deterministically. Weather is intentionally
// NOT baked here: it's fetched live at request time since it must be current.
import worldCountries from "world-countries/countries.json" with { type: "json" };
import * as ct from "countries-and-timezones";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "src", "data");
const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";
const USER_AGENT =
  "WorldAtlasExplorer/1.0 (https://github.com/; build-time data generation script)";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sparql(query, { retries = 3 } = {}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const url = new URL(SPARQL_ENDPOINT);
    url.searchParams.set("query", query);
    url.searchParams.set("format", "json");
    const res = await fetch(url, {
      headers: {
        Accept: "application/sparql-results+json",
        "User-Agent": USER_AGENT,
      },
    });
    if (res.ok) {
      const json = await res.json();
      return json.results.bindings;
    }
    console.warn(
      `  SPARQL attempt ${attempt} failed (${res.status}), retrying...`
    );
    await sleep(2000 * attempt);
  }
  throw new Error("SPARQL query failed after retries");
}

function wkt(point) {
  if (!point) return null;
  const m = /Point\(([-\d.]+)\s+([-\d.]+)\)/.exec(point);
  if (!m) return null;
  return { lng: Number(m[1]), lat: Number(m[2]) };
}

function qid(uri) {
  if (!uri) return null;
  return uri.split("/").pop();
}

// SERVICE wikibase:label silently falls back to the entity's own QID
// (e.g. "Q126722228") as the "label" when no en/mul label exists — that's
// not a name, so treat it as absent.
const QID_LABEL_PATTERN = /^Q\d+$/;
function realLabel(value) {
  if (!value || QID_LABEL_PATTERN.test(value)) return null;
  return value;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  console.log(`Loaded ${worldCountries.length} countries from world-countries`);
  const iso3List = worldCountries.map((c) => c.cca3);

  // ---- World Bank: population + GDP (2 bulk calls, all countries) ----
  console.log("Fetching World Bank population + GDP...");
  const [popRows, gdpRows] = await Promise.all([
    fetchWorldBank("SP.POP.TOTL"),
    fetchWorldBank("NY.GDP.MKTP.CD"),
  ]);
  const popByIso3 = indexWorldBank(popRows);
  const gdpByIso3 = indexWorldBank(gdpRows);
  console.log(
    `  population: ${popByIso3.size} countries, GDP: ${gdpByIso3.size} countries`
  );

  // ---- Wikidata: iso3 <-> QID lookup, shared by every query below ----
  console.log("Fetching Wikidata iso3<->QID map...");
  const qidByIso3 = await fetchIso3ToQid();
  const iso3ByQid = new Map([...qidByIso3.entries()].map(([iso3, q]) => [q, iso3]));
  console.log(`  resolved ${qidByIso3.size} countries`);

  // ---- Wikidata: core facts (coat of arms, driving side, capital coord) ----
  console.log("Fetching Wikidata core facts (batched)...");
  const coreFacts = await fetchWikidataCoreFacts(iso3List);
  console.log(`  got facts for ${coreFacts.size} countries`);

  // ---- Wikidata: UNESCO World Heritage Sites ----
  console.log("Fetching Wikidata UNESCO sites (global)...");
  const unescoByIso3 = await fetchUnesco(iso3ByQid);
  const unescoTotal = [...unescoByIso3.values()].reduce(
    (n, arr) => n + arr.length,
    0
  );
  console.log(
    `  ${unescoTotal} sites across ${unescoByIso3.size} countries`
  );

  // ---- Wikidata: national parks ----
  console.log("Fetching Wikidata national parks (global)...");
  const parksByIso3 = await fetchParks(iso3ByQid);
  const parksTotal = [...parksByIso3.values()].reduce(
    (n, arr) => n + arr.length,
    0
  );
  console.log(`  ${parksTotal} parks across ${parksByIso3.size} countries`);

  // ---- Wikidata: elevation extremes ----
  console.log("Fetching Wikidata elevation extremes (global)...");
  const elevationByIso3 = await fetchElevation();
  console.log(`  elevation data for ${elevationByIso3.size} countries`);

  // ---- Wikidata: major cities ----
  console.log("Fetching Wikidata major cities (global, population > 300k)...");
  const citiesByIso3 = await fetchCities(iso3ByQid);
  const citiesTotal = [...citiesByIso3.values()].reduce(
    (n, arr) => n + arr.length,
    0
  );
  console.log(`  ${citiesTotal} cities across ${citiesByIso3.size} countries`);

  // ---- Merge everything into the final country record ----
  const countries = worldCountries.map((c) => {
    const iso3 = c.cca3;
    const iso2 = c.cca2;
    const facts = coreFacts.get(iso3);
    const timezoneNames = new Set();
    for (const tz of ct.getTimezonesForCountry(iso2) ?? []) {
      timezoneNames.add(tz.name);
    }

    return {
      cca2: iso2,
      cca3: iso3,
      ccn3: c.ccn3 ?? null,
      name: {
        common: c.name.common,
        official: c.name.official,
      },
      independent: !!c.independent,
      unMember: !!c.unMember,
      status: c.status,
      capital: c.capital ?? [],
      capitalCoordinates: facts?.capitalCoord ?? null,
      region: c.region,
      subregion: c.subregion ?? null,
      languages: c.languages ?? {},
      currencies: c.currencies ?? {},
      idd: c.idd ?? { root: null, suffixes: [] },
      tld: c.tld ?? [],
      latlng: c.latlng ?? null,
      landlocked: !!c.landlocked,
      borders: c.borders ?? [],
      area: c.area ?? null,
      flagEmoji: c.flag,
      demonyms: c.demonyms ?? {},
      drivingSide: facts?.drivingSide ?? null,
      coatOfArms: facts?.coatOfArms ?? null,
      timezones: [...timezoneNames].sort(),
      population: popByIso3.get(iso3) ?? null,
      gdpUsd: gdpByIso3.get(iso3) ?? null,
      flags: {
        svg: `https://flagcdn.com/${iso2.toLowerCase()}.svg`,
        png: `https://flagcdn.com/w320/${iso2.toLowerCase()}.png`,
        png640: `https://flagcdn.com/w640/${iso2.toLowerCase()}.png`,
      },
      maps: {
        googleMaps: c.latlng
          ? `https://www.google.com/maps/search/?api=1&query=${c.latlng[0]},${c.latlng[1]}`
          : null,
        openStreetMap: c.latlng
          ? `https://www.openstreetmap.org/?mlat=${c.latlng[0]}&mlon=${c.latlng[1]}#map=5/${c.latlng[0]}/${c.latlng[1]}`
          : null,
      },
    };
  });

  await writeJson("countries.json", countries);
  await writeJson("unesco.json", Object.fromEntries(unescoByIso3));
  await writeJson("parks.json", Object.fromEntries(parksByIso3));
  await writeJson("elevation.json", Object.fromEntries(elevationByIso3));
  await writeJson("cities.json", Object.fromEntries(citiesByIso3));

  const codeMap = Object.fromEntries(
    countries
      .filter((c) => c.ccn3)
      .map((c) => [c.ccn3, { code: c.cca3, name: c.name.common }])
  );
  const publicGlobeDir = path.join(__dirname, "..", "public", "globe");
  await mkdir(publicGlobeDir, { recursive: true });
  await writeFile(
    path.join(publicGlobeDir, "country-code-map.json"),
    JSON.stringify(codeMap),
    "utf-8"
  );
  console.log("  wrote public/globe/country-code-map.json");

  console.log("\nDone. Wrote countries.json, unesco.json, parks.json, elevation.json, cities.json");
}

async function writeJson(filename, data) {
  const file = path.join(OUT_DIR, filename);
  await writeFile(file, JSON.stringify(data), "utf-8");
  console.log(`  wrote ${filename}`);
}

async function fetchWorldBank(indicator) {
  const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&mrnev=1&per_page=20000`;
  const res = await fetch(url);
  const json = await res.json();
  return json[1] ?? [];
}

function indexWorldBank(rows) {
  const map = new Map();
  for (const row of rows) {
    if (row.value != null && row.countryiso3code) {
      map.set(row.countryiso3code, row.value);
    }
  }
  return map;
}

async function fetchWikidataCoreFacts(iso3List) {
  const values = iso3List.map((c) => `"${c}"`).join(" ");
  const query = `
    SELECT ?iso3 ?coa ?drivingSideLabel ?capCoord WHERE {
      VALUES ?iso3 { ${values} }
      ?country wdt:P298 ?iso3.
      OPTIONAL { ?country wdt:P94 ?coa. }
      OPTIONAL { ?country wdt:P1622 ?drivingSide. }
      OPTIONAL { ?country wdt:P36 ?capital. ?capital wdt:P625 ?capCoord. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en,mul". }
    }
  `;
  const rows = await sparql(query);
  const map = new Map();
  for (const row of rows) {
    const iso3 = row.iso3.value;
    const existing = map.get(iso3) ?? {};
    map.set(iso3, {
      coatOfArms: existing.coatOfArms ?? row.coa?.value ?? null,
      drivingSide:
        existing.drivingSide ?? row.drivingSideLabel?.value ?? null,
      capitalCoord: existing.capitalCoord ?? wkt(row.capCoord?.value),
    });
  }
  return map;
}

async function fetchUnesco(iso3ByQid) {
  const [componentsRows, sitesRows] = await Promise.all([
    sparql(`
      SELECT ?site ?parent WHERE {
        ?site wdt:P361 ?parent.
        ?parent wdt:P1435 wd:Q9259.
      }
    `),
    sparql(`
      SELECT ?site ?siteLabel ?country ?coord WHERE {
        ?site wdt:P1435 wd:Q9259.
        ?site wdt:P17 ?country.
        OPTIONAL { ?site wdt:P625 ?coord. }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,mul". }
      }
    `),
  ]);

  const childSites = new Set(componentsRows.map((r) => qid(r.site.value)));
  const qidToIso3 = iso3ByQid;

  const byIso3 = new Map();
  const seenPerCountry = new Map();
  for (const row of sitesRows) {
    const name = realLabel(row.siteLabel?.value);
    if (!name) continue;
    const siteQid = qid(row.site.value);
    if (childSites.has(siteQid)) continue;
    const countryQid = qid(row.country.value);
    const iso3 = qidToIso3.get(countryQid);
    if (!iso3) continue;
    const seenKey = `${iso3}:${siteQid}`;
    const seen = seenPerCountry.get(seenKey);
    if (seen) continue;
    seenPerCountry.set(seenKey, true);
    if (!byIso3.has(iso3)) byIso3.set(iso3, []);
    byIso3.get(iso3).push({
      name,
      coordinates: wkt(row.coord?.value),
    });
  }
  for (const list of byIso3.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }
  return byIso3;
}

async function fetchIso3ToQid() {
  const query = `
    SELECT ?iso3 ?country WHERE {
      ?country wdt:P298 ?iso3.
    }
  `;
  const rows = await sparql(query);
  const map = new Map();
  for (const row of rows) {
    map.set(row.iso3.value, qid(row.country.value));
  }
  return map;
}

async function fetchParks(qidToIso3) {
  const rows = await sparql(`
    SELECT ?site ?siteLabel ?country ?coord WHERE {
      ?site wdt:P31 wd:Q46169.
      ?site wdt:P17 ?country.
      OPTIONAL { ?site wdt:P625 ?coord. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en,mul". }
    }
  `);
  const byIso3 = new Map();
  const seen = new Set();
  for (const row of rows) {
    const name = realLabel(row.siteLabel?.value);
    if (!name) continue;
    const countryQid = qid(row.country.value);
    const iso3 = qidToIso3.get(countryQid);
    if (!iso3) continue;
    const siteQid = qid(row.site.value);
    const key = `${iso3}:${siteQid}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (!byIso3.has(iso3)) byIso3.set(iso3, []);
    byIso3.get(iso3).push({
      name,
      coordinates: wkt(row.coord?.value),
    });
  }
  for (const list of byIso3.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }
  return byIso3;
}

async function fetchElevation() {
  const rows = await sparql(`
    SELECT ?iso3 ?highLabel ?highElev ?highCoord ?lowLabel ?lowElev ?lowCoord WHERE {
      ?country wdt:P298 ?iso3.
      OPTIONAL {
        ?country wdt:P610 ?high.
        OPTIONAL { ?high wdt:P2044 ?highElev. }
        OPTIONAL { ?high wdt:P625 ?highCoord. }
      }
      OPTIONAL {
        ?country wdt:P1589 ?low.
        OPTIONAL { ?low wdt:P2044 ?lowElev. }
        OPTIONAL { ?low wdt:P625 ?lowCoord. }
      }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en,mul". }
    }
  `);

  const byIso3 = new Map();
  for (const row of rows) {
    const iso3 = row.iso3.value;
    if (!byIso3.has(iso3)) byIso3.set(iso3, { highest: null, lowest: null });
    const entry = byIso3.get(iso3);

    const highName = realLabel(row.highLabel?.value);
    if (highName) {
      const elev = row.highElev?.value ? Number(row.highElev.value) : null;
      if (!entry.highest || (elev != null && elev > (entry.highest.elevationMeters ?? -Infinity))) {
        entry.highest = {
          name: highName,
          elevationMeters: elev,
          coordinates: wkt(row.highCoord?.value),
        };
      }
    }
    const lowName = realLabel(row.lowLabel?.value);
    if (lowName) {
      const elev = row.lowElev?.value ? Number(row.lowElev.value) : null;
      if (!entry.lowest || (elev != null && elev < (entry.lowest.elevationMeters ?? Infinity))) {
        entry.lowest = {
          name: lowName,
          elevationMeters: elev,
          coordinates: wkt(row.lowCoord?.value),
        };
      }
    }
  }
  return byIso3;
}

async function fetchCities(qidToIso3) {
  const rows = await sparql(`
    SELECT ?city ?cityLabel ?country ?pop ?coord WHERE {
      ?city wdt:P31/wdt:P279* wd:Q515.
      ?city wdt:P17 ?country.
      ?city wdt:P1082 ?pop.
      FILTER(?pop > 300000)
      OPTIONAL { ?city wdt:P625 ?coord. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en,mul". }
    }
  `);

  // Filters out cross-border conurbations ("El Paso–Juárez", joined
  // with an en dash) and metro-area aggregates, which the broad Q515 subclass
  // walk otherwise pulls in alongside actual cities.
  const NOISY_NAME = /metropolitan area|–/i;

  const byCity = new Map();
  for (const row of rows) {
    const name = realLabel(row.cityLabel?.value);
    const countryQid = qid(row.country.value);
    const iso3 = qidToIso3.get(countryQid);
    if (!iso3 || !name) continue;
    if (NOISY_NAME.test(name)) continue;
    const cityQid = qid(row.city.value);
    const pop = Number(row.pop.value);
    const key = `${iso3}:${cityQid}`;
    const existing = byCity.get(key);
    if (!existing || pop > existing.population) {
      byCity.set(key, {
        iso3,
        name,
        population: pop,
        coordinates: wkt(row.coord?.value),
      });
    }
  }

  // Wikidata often has both "Lyon" (the city) and "Metropolis of Lyon" (the
  // surrounding administrative unit) as separate items. Drop the wrapper
  // when the plain name is already present, so cities lists don't duplicate.
  const ADMIN_WRAPPER = /^(metropolis of|prefecture of|urban area of|greater)\s+/i;
  const byIso3Names = new Map();
  for (const city of byCity.values()) {
    if (!byIso3Names.has(city.iso3)) byIso3Names.set(city.iso3, new Set());
    byIso3Names.get(city.iso3).add(city.name);
  }

  const byIso3 = new Map();
  for (const city of byCity.values()) {
    const bareName = city.name.replace(ADMIN_WRAPPER, "");
    if (bareName !== city.name && byIso3Names.get(city.iso3)?.has(bareName)) {
      continue;
    }
    if (!byIso3.has(city.iso3)) byIso3.set(city.iso3, []);
    byIso3.get(city.iso3).push({
      name: city.name,
      population: city.population,
      coordinates: city.coordinates,
    });
  }
  for (const [iso3, list] of byIso3) {
    list.sort((a, b) => b.population - a.population);
    byIso3.set(iso3, list.slice(0, 8));
  }
  return byIso3;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
