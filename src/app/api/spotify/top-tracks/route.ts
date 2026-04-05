import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTopTracks, type TimeRange } from "@/lib/spotify";

const VALID_RANGES = new Set(["short_term", "medium_term", "long_term"]);

export async function GET(request: NextRequest) {
  const range = request.nextUrl.searchParams.get("range") ?? "medium_term";

  if (!VALID_RANGES.has(range)) {
    return NextResponse.json({ error: "Invalid range" }, { status: 400 });
  }

  const tracks = await getTopTracks(range as TimeRange);

  return NextResponse.json(tracks, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
