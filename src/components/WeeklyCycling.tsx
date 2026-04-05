"use client";

import { useEffect, useState } from "react";

interface WeeklyData {
  km: number;
  activityCount: number;
  city: string | null;
  country: string | null;
}

export function WeeklyCycling() {
  const [data, setData] = useState<WeeklyData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/strava/weekly");
        if (!res.ok) return;
        const json: WeeklyData = await res.json();
        if (json.km > 0) setData(json);
      } catch {
        // Non-critical
      }
    }

    fetchData();
  }, []);

  if (!data) return null;

  const location = [data.city, data.country].filter(Boolean).join(", ");

  return (
    <p className="font-mono text-sm font-bold tracking-wide text-brand-muted text-center">
      This week I have cycled {data.km} km{location ? ` in ${location}` : ""}.
    </p>
  );
}
