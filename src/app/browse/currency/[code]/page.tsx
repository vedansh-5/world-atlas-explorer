import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { CountryGrid } from "@/components/shared/country-grid";
import { getCountriesByCurrency } from "@/lib/data/countries";

export function generateStaticParams() {
  return getCountriesByCurrency().map((c) => ({ code: c.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const currency = getCountriesByCurrency().find((c) => c.code === code);
  if (!currency) return {};
  return { title: `${currency.name} (${currency.code})` };
}

export default async function CurrencyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const currency = getCountriesByCurrency().find((c) => c.code === code);
  if (!currency) notFound();

  return (
    <div>
      <PageHeader
        title={`${currency.name} (${currency.symbol})`}
        subtitle={`Used in ${currency.countries.length} countries and territories`}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <CountryGrid countries={currency.countries} />
      </div>
    </div>
  );
}
