import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CompareView } from "@/components/compare/compare-view";
import { getSearchIndex } from "@/lib/data/countries";

export const metadata: Metadata = { title: "Compare countries" };

export default function ComparePage() {
  const countries = getSearchIndex();

  return (
    <div>
      <PageHeader
        title="Compare countries"
        subtitle="Pick two countries to see how they stack up"
      />
      <CompareView countries={countries} />
    </div>
  );
}
