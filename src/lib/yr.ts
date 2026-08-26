// MET Norway Locationforecast (the API behind yr.no).
// No API key, but the terms require a User-Agent that identifies the app,
// and that we respect the Expires header rather than polling. See
// https://api.met.no/doc/TermsOfService
const API =
  "https://api.met.no/weatherapi/locationforecast/2.0/compact";
const USER_AGENT = "lunde.io/1.0 (https://lunde.io)";

// Oslo. MET asks for no more than 4 decimals of precision.
export const OSLO = { lat: 59.9139, lon: 10.7522 };

export interface Weather {
  temperature: number;
  symbol: string | null;
}

export async function getWeather(
  lat: number = OSLO.lat,
  lon: number = OSLO.lon,
): Promise<Weather | null> {
  try {
    const res = await fetch(`${API}?lat=${lat}&lon=${lon}`, {
      headers: { "User-Agent": USER_AGENT },
      // Revalidated by the route's Cache-Control; don't hold a stale copy here.
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = await res.json();
    const now = data?.properties?.timeseries?.[0];
    const temperature = now?.data?.instant?.details?.air_temperature;
    if (typeof temperature !== "number") return null;

    return {
      temperature: Math.round(temperature),
      symbol:
        now.data.next_1_hours?.summary?.symbol_code ??
        now.data.next_6_hours?.summary?.symbol_code ??
        null,
    };
  } catch {
    return null;
  }
}
