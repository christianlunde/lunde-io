import { NextResponse } from "next/server";
import { probeSpotify } from "@/lib/spotify";
import { probeStrava } from "@/lib/strava";
import { getWeather } from "@/lib/yr";

/**
 * Integration health: exercises each token/API for real, so the failure
 * mode that hid the Strava outage for eight weeks (valid token, dead app)
 * is visible in one request. 200 when everything works, 503 otherwise —
 * uptime monitors can alert on the status code alone.
 */
export async function GET() {
  const [spotify, strava, weather] = await Promise.all([
    probeSpotify(),
    probeStrava(),
    getWeather().then((w) => w !== null),
  ]);

  const ok = spotify && strava && weather;

  return NextResponse.json(
    {
      spotify: spotify ? "ok" : "fail",
      strava: strava ? "ok" : "fail",
      weather: weather ? "ok" : "fail",
      checkedAt: new Date().toISOString(),
    },
    {
      status: ok ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
