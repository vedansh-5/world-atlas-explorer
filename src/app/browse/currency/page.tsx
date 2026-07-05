import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { getCountriesByCurrency } from "@/lib/data/countries";

export const metadata: Metadata = { title: "Browse by currency" };

export default function CurrencyIndexPage() {
  const currencies = getCountriesByCurrency();

  return (
    <div>
      <PageHeader
        title="Browse by currency"
        subtitle={`${currencies.length} currencies used around the world`}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {currencies.map((currency) => (
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
      </div>
    </div>
  );
}
