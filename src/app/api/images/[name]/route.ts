import { NextResponse } from "next/server";
import type { CountryImage } from "@/lib/types";

export const revalidate = 86400; // 24 hours

const EXCLUDED_PATTERN =
  /flag|coat[_ ]?of[_ ]?arms|locator|orthographic|\.svg$|\.ogg$|\.oga$|\.webm$|emblem|seal[_ ]?of/i;

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const title = decodeURIComponent(name);

  const mediaListRes = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`,
    { next: { revalidate: 86400 } }
  );

  if (!mediaListRes.ok) {
    return NextResponse.json<CountryImage[]>([]);
  }

  const mediaList = await mediaListRes.json();
  const candidates: string[] = (mediaList.items ?? [])
    .filter(
      (item: { type: string; title: string }) =>
        item.type === "image" &&
        /\.(jpe?g|png)$/i.test(item.title) &&
        !EXCLUDED_PATTERN.test(item.title)
    )
    .map((item: { title: string }) => item.title)
    .slice(0, 8);

  if (candidates.length === 0) {
    return NextResponse.json<CountryImage[]>([]);
  }

  const infoUrl = new URL("https://en.wikipedia.org/w/api.php");
  infoUrl.searchParams.set("action", "query");
  infoUrl.searchParams.set("titles", candidates.join("|"));
  infoUrl.searchParams.set("prop", "imageinfo");
  infoUrl.searchParams.set("iiprop", "url|size|extmetadata");
  infoUrl.searchParams.set("iiurlwidth", "1200");
  infoUrl.searchParams.set("format", "json");

  const infoRes = await fetch(infoUrl, { next: { revalidate: 86400 } });
  if (!infoRes.ok) {
    return NextResponse.json<CountryImage[]>([]);
  }

  const infoJson = await infoRes.json();
  const pages = Object.values(infoJson.query?.pages ?? {}) as Array<{
    title: string;
    imageinfo?: Array<{
      thumburl?: string;
      url: string;
      thumbwidth?: number;
      thumbheight?: number;
      width: number;
      height: number;
      descriptionurl: string;
      extmetadata?: { ImageDescription?: { value: string } };
    }>;
  }>;

  const images: CountryImage[] = pages
    .map((page) => {
      const info = page.imageinfo?.[0];
      if (!info) return null;
      const description = info.extmetadata?.ImageDescription?.value;
      return {
        url: info.thumburl ?? info.url,
        width: info.thumbwidth ?? info.width,
        height: info.thumbheight ?? info.height,
        description: description ? stripHtml(description).slice(0, 200) : null,
        source: "wikipedia" as const,
        pageUrl: info.descriptionurl,
      };
    })
    .filter((img): img is CountryImage => img !== null)
    .slice(0, 6);

  return NextResponse.json(images);
}
