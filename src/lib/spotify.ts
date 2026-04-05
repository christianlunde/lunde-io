const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

// --- Types ---

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  genres: string[];
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  artists: { name: string; external_urls: { spotify: string } }[];
  album: {
    name: string;
    images: SpotifyImage[];
  };
  external_urls: { spotify: string };
}

export interface NowPlayingData {
  isPlaying: true;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  songUrl: string;
}

export interface NotPlayingData {
  isPlaying: false;
}

export type TimeRange = "short_term" | "medium_term" | "long_term";

// --- Token Management ---

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
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

  if (!res.ok) {
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  // Expire 60s early to avoid edge-case failures
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  return cachedToken!;
}

async function spotifyFetch(endpoint: string) {
  const token = await getAccessToken();
  return fetch(`${API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

// --- API Helpers ---

export async function getNowPlaying(): Promise<NowPlayingData | NotPlayingData> {
  try {
    const res = await spotifyFetch("/me/player/currently-playing");

    if (res.status === 204 || res.status === 202) {
      return { isPlaying: false };
    }

    const data = await res.json();

    if (!data.is_playing || !data.item) {
      return { isPlaying: false };
    }

    return {
      isPlaying: true,
      title: data.item.name,
      artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
      album: data.item.album.name,
      albumArt: data.item.album.images[0]?.url ?? "",
      songUrl: data.item.external_urls.spotify,
    };
  } catch {
    return { isPlaying: false };
  }
}

export async function getTopArtists(
  range: TimeRange = "medium_term",
  limit = 12,
): Promise<SpotifyArtist[]> {
  try {
    const res = await spotifyFetch(`/me/top/artists?time_range=${range}&limit=${limit}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function getTopTracks(
  range: TimeRange = "medium_term",
  limit = 10,
): Promise<SpotifyTrack[]> {
  try {
    const res = await spotifyFetch(`/me/top/tracks?time_range=${range}&limit=${limit}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function getRecentlyPlayed(limit = 20): Promise<
  { track: SpotifyTrack; played_at: string }[]
> {
  try {
    const res = await spotifyFetch(`/me/player/recently-played?limit=${limit}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}
