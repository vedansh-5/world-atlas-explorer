export function formatNumber(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCompactNumber(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatArea(sqKm: number | null | undefined): string {
  if (sqKm == null) return "—";
  return `${formatNumber(Math.round(sqKm))} km²`;
}

export function formatPopulation(value: number | null | undefined): string {
  if (value == null) return "—";
  return formatNumber(value);
}

export function formatCurrencyAmount(
  value: number,
  currencyCode: string
): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  } catch {
    return `${formatCompactNumber(value)} ${currencyCode}`;
  }
}

export function formatGdp(value: number | null | undefined): string {
  if (value == null) return "Not available";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatElevation(meters: number | null | undefined): string {
  if (meters == null) return "—";
  return `${formatNumber(Math.round(meters))} m`;
}

export function formatLanguageList(languages: Record<string, string>): string {
  const values = Object.values(languages);
  if (values.length === 0) return "—";
  return values.join(", ");
}

export function formatCurrencyList(
  currencies: Record<string, { name: string; symbol: string }>
): string {
  const entries = Object.entries(currencies);
  if (entries.length === 0) return "—";
  return entries.map(([, c]) => `${c.name} (${c.symbol})`).join(", ");
}

export function formatCallingCode(idd: {
  root: string | null;
  suffixes: string[];
}): string {
  if (!idd.root) return "—";
  if (idd.suffixes.length === 1) return `${idd.root}${idd.suffixes[0]}`;
  if (idd.suffixes.length === 0) return idd.root;
  return idd.root;
}

export function formatDrivingSide(side: "left" | "right" | null): string {
  if (!side) return "—";
  return side === "left" ? "Left-hand traffic" : "Right-hand traffic";
}

export function formatTimezones(timezones: string[]): string {
  if (timezones.length === 0) return "—";
  if (timezones.length <= 2) return timezones.join(", ");
  return `${timezones.slice(0, 2).join(", ")} +${timezones.length - 2} more`;
}

export function titleCase(value: string): string {
  return value.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase());
}
