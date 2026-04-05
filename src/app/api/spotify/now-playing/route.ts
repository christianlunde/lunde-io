import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";

export async function GET() {
  const data = await getNowPlaying();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
