import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { CountryGrid } from "@/components/shared/country-grid";
import { getCountriesByLanguage } from "@/lib/data/countries";

export function generateStaticParams() {
  return getCountriesByLanguage().map((lang) => ({ code: lang.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const lang = getCountriesByLanguage().find((l) => l.code === code);
  if (!lang) return {};
  return { title: `${lang.name} speaking countries` };
}

export default async function LanguagePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const lang = getCountriesByLanguage().find((l) => l.code === code);
  if (!lang) notFound();

  return (
    <div>
      <PageHeader
        title={lang.name}
        subtitle={`Spoken in ${lang.countries.length} countries and territories`}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <CountryGrid countries={lang.countries} />
      </div>
    </div>
  );
}
