const CLIENT_ID = process.env.STRAVA_CLIENT_ID!;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN!;

const TOKEN_URL = "https://www.strava.com/oauth/token";
const API_BASE = "https://www.strava.com/api/v3";

// --- Types ---

export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: string;
  start_date_local: string;
  average_speed: number;
  max_speed: number;
  location_city: string | null;
  location_country: string | null;
}

export interface WeeklyStats {
  totalDistance: number;
  totalTime: number;
  totalElevation: number;
  activityCount: number;
  activities: StravaActivity[];
}

// --- Token Management ---

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Strava token refresh failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = data.expires_at * 1000 - 60_000;

  return cachedToken!;
}

async function stravaFetch(endpoint: string) {
  const token = await getAccessToken();
  return fetch(`${API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

// --- API Helpers ---

export async function getWeeklyActivities(type?: string): Promise<WeeklyStats> {
  try {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const after = Math.floor(monday.getTime() / 1000);

    const res = await stravaFetch(`/athlete/activities?after=${after}&per_page=50`);
    if (!res.ok) {
      console.error(`[strava] weekly activities failed: ${res.status}`);
      return { totalDistance: 0, totalTime: 0, totalElevation: 0, activityCount: 0, activities: [] };
    }

    let activities: StravaActivity[] = await res.json();

    if (type) {
      activities = activities.filter(
        (a) => a.type.toLowerCase() === type.toLowerCase() || a.sport_type.toLowerCase() === type.toLowerCase(),
      );
    }

    return {
      totalDistance: activities.reduce((sum, a) => sum + a.distance, 0),
      totalTime: activities.reduce((sum, a) => sum + a.moving_time, 0),
      totalElevation: activities.reduce((sum, a) => sum + a.total_elevation_gain, 0),
      activityCount: activities.length,
      activities,
    };
  } catch (err) {
    console.error("[strava] weekly activities error:", err);
    return { totalDistance: 0, totalTime: 0, totalElevation: 0, activityCount: 0, activities: [] };
  }
}

export async function getRecentActivity(): Promise<StravaActivity | null> {
  try {
    const res = await stravaFetch("/athlete/activities?per_page=1");
    if (!res.ok) {
      console.error(`[strava] recent activity failed: ${res.status}`);
      return null;
    }
    const activities: StravaActivity[] = await res.json();
    return activities[0] ?? null;
  } catch (err) {
    console.error("[strava] recent activity error:", err);
    return null;
  }
}

// --- Health ---

/** True when the token refresh AND an authenticated API call both work —
 *  catches the app-deactivated case (403 Inactive), where the token refresh
 *  alone still succeeds. */
export async function probeStrava(): Promise<boolean> {
  try {
    const res = await stravaFetch("/athlete");
    if (!res.ok) console.error(`[strava] health probe failed: ${res.status}`);
    return res.ok;
  } catch (err) {
    console.error("[strava] health probe error:", err);
    return false;
  }
}
