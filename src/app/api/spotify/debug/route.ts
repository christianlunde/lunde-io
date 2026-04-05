import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

export async function GET() {
  const envCheck = {
    hasClientId: !!CLIENT_ID,
    hasClientSecret: !!CLIENT_SECRET,
    hasRefreshToken: !!REFRESH_TOKEN,
    refreshTokenLength: REFRESH_TOKEN?.length ?? 0,
  };

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return NextResponse.json({ error: "Missing env vars", ...envCheck });
  }

  try {
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: REFRESH_TOKEN,
      }),
      cache: "no-store",
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return NextResponse.json({ error: "Token refresh failed", status: tokenRes.status, tokenData, ...envCheck });
    }

    const apiRes = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=1", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      cache: "no-store",
    });

    const apiData = await apiRes.json();

    return NextResponse.json({
      ...envCheck,
      tokenOk: true,
      apiStatus: apiRes.status,
      apiData,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e), ...envCheck });
  }
}
