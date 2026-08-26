import { NextResponse } from "next/server";
import { getWeather } from "@/lib/yr";

export async function GET() {
  const weather = await getWeather();

  return NextResponse.json(weather ?? {}, {
    headers: {
      // MET's own Expires sits ~30 min out; mirror that rather than polling.
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
