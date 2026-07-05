import { NextRequest, NextResponse } from "next/server";
import { getCountryByCode } from "@/lib/data/countries";
import type { Country } from "@/lib/types";

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const codesParam = req.nextUrl.searchParams.get("codes");
  if (!codesParam) {
    return NextResponse.json({ error: "codes query param is required" }, { status: 400 });
  }

  const codes = codesParam
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean)
    .slice(0, 20);

  const countries = codes
    .map((code) => getCountryByCode(code))
    .filter((c): c is Country => Boolean(c));

  return NextResponse.json(countries);
}
