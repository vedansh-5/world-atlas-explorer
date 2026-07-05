import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { getCountriesByLanguage } from "@/lib/data/countries";

export const metadata: Metadata = { title: "Browse by language" };

export default function LanguageIndexPage() {
  const languages = getCountriesByLanguage();

  return (
    <div>
      <PageHeader
        title="Browse by language"
        subtitle={`${languages.length} languages spoken across the world`}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
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
      </div>
    </div>
  );
}
