import Link from "next/link";
import { SectionHeader } from "@/components/shared/section-header";
import type { CurrencyGroup, LanguageGroup } from "@/lib/data/countries";

export function LanguagePreview({ languages }: { languages: LanguageGroup[] }) {
  const top = languages.slice(0, 14);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeader
        title="Browse by language"
        subtitle="Spoken across borders and continents"
        href="/browse/language"
      />
      <div className="flex flex-wrap gap-2">
        {top.map((lang) => (
          <Link
            key={lang.code}
            href={`/browse/language/${lang.code}`}
            className="rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            {lang.name}
            <span className="ml-1.5 text-muted-foreground">
              {lang.countries.length}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CurrencyPreview({ currencies }: { currencies: CurrencyGroup[] }) {
  const top = currencies.slice(0, 14);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeader
        title="Browse by currency"
        subtitle="What the world trades in"
        href="/browse/currency"
      />
      <div className="flex flex-wrap gap-2">
        {top.map((currency) => (
          <Link
            key={currency.code}
            href={`/browse/currency/${currency.code}`}
            className="rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="text-muted-foreground">{currency.symbol}</span>{" "}
            {currency.name}
            <span className="ml-1.5 text-muted-foreground">
              {currency.countries.length}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
