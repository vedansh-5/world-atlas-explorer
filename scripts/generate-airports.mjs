// Build-time data generation: downloads the OurAirports open dataset (public
// domain, no API key) and keeps only large airports and scheduled-service
// medium airports with an IATA code, grouped by ISO alpha-2 country. Run with
// `npm run generate:airports`. Safe to re-run any time.
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "src", "data");
const CSV_URL = "https://davidmegginson.github.io/ourairports-data/airports.csv";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  console.log(`Downloading ${CSV_URL} ...`);
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`Failed to download airports CSV: ${res.status}`);
  const text = await res.text();

  const rows = parseCsv(text);
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  const byCountry = new Map();
  let kept = 0;
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length < header.length) continue;
    const type = r[idx.type];
    const scheduled = r[idx.scheduled_service];
    const iata = r[idx.iata_code];
    const isLarge = type === "large_airport";
    const isMediumScheduled =
      type === "medium_airport" && scheduled === "yes" && iata;
    if (!isLarge && !isMediumScheduled) continue;

    const iso2 = r[idx.iso_country];
    if (!iso2) continue;
    const lat = Number(r[idx.latitude_deg]);
    const lng = Number(r[idx.longitude_deg]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

    if (!byCountry.has(iso2)) byCountry.set(iso2, []);
    byCountry.get(iso2).push({
      name: r[idx.name],
      iata: iata || null,
      icao: r[idx.icao_code] || null,
      municipality: r[idx.municipality] || null,
      type: isLarge ? "large" : "medium",
      coordinates: { lat, lng },
    });
    kept++;
  }

  for (const list of byCountry.values()) {
    list.sort((a, b) => {
      if (a.type !== b.type) return a.type === "large" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }

  const out = Object.fromEntries(byCountry);
  await writeFile(
    path.join(OUT_DIR, "airports.json"),
    JSON.stringify(out),
    "utf-8"
  );
  console.log(
    `Kept ${kept} airports across ${byCountry.size} countries -> src/data/airports.json`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
