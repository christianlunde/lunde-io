import { NextResponse } from "next/server";
import { getWeeklyActivities } from "@/lib/strava";

export async function GET() {
  const stats = await getWeeklyActivities("ride");

  const km = Math.round(stats.totalDistance / 1000);

  // Get location from the most recent ride
  const lastRide = stats.activities[0];
  const city = lastRide?.location_city || null;
  const country = lastRide?.location_country || null;

  return NextResponse.json(
    {
      km,
      activityCount: stats.activityCount,
      city,
      country,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    },
  );
}
