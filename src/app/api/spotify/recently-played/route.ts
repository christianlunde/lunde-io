import { NextResponse } from "next/server";
import { getRecentlyPlayed } from "@/lib/spotify";

export async function GET() {
  const items = await getRecentlyPlayed();

  return NextResponse.json(items, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
