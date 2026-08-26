"use client";

import { useEffect, useState } from "react";

interface Props {
  city?: string;
  timezone?: string;
}

/**
 * Renders "20 °C Oslo 12:23". The temperature is dropped until Yr answers, so
 * the line reads "Oslo 12:23" rather than showing a placeholder.
 */
export function LocalStatus({ city: cityProp, timezone: timezoneProp }: Props) {
  const [place, setPlace] = useState<{ city: string; time: string } | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);

  useEffect(() => {
    const timezone = timezoneProp || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const city = cityProp || timezone.split("/").pop()?.replace(/_/g, " ") || "";

    function getTime() {
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timezone,
      }).format(new Date());
    }

    setPlace({ city, time: getTime() });

    const interval = setInterval(() => {
      setPlace((prev) => (prev ? { ...prev, time: getTime() } : null));
    }, 30_000);

    return () => clearInterval(interval);
  }, [cityProp, timezoneProp]);

  useEffect(() => {
    let active = true;

    async function fetchWeather() {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) return;
        const data: { temperature?: number } = await res.json();
        if (active && typeof data.temperature === "number") {
          setTemperature(data.temperature);
        }
      } catch {
        // Non-critical
      }
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60_000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (!place) return null;

  return (
    <span>
      {temperature !== null && `${temperature} °C `}
      {place.city} {place.time}
    </span>
  );
}
